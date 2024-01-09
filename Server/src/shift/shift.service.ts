import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShiftDTO, TransactionDTO } from './dto/shift.dto';

@Injectable()
export class ShiftService {
  constructor(private prisma: PrismaService) {}

  async openShift(userId: string,dto:ShiftDTO) {
    const employee = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        shift: {
          orderBy: {
            startTime: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (!employee.shift || employee.shift.length === 0) {
      // No shifts found for the employee, create a new shift
      const shift = await this.prisma.shift.create({
        data: {
          startTime: new Date().toLocaleString(),
          Employee: {
            connect: {
              id: userId,
            },
          },
          CashManagement:{
            create:{
              FireKirin:{
                create:{
                  openingAmount:dto.fkOpeningAmount,
                }
              },
              OrionStars:{
                create:{
                  openingAmount:dto.orionOpeningAmount,
                }
              }
            }
          }
        },
        include:{
          CashManagement:{
            include:{
              FireKirin:true,
              OrionStars:true
            }
          }
        }
      });

      return {
        status: 'success',
        data: {
          shiftId: shift.id,
          openingTime: shift.startTime,
          employeeName: employee.name,
          fkOpeningAmount:shift.CashManagement[0].FireKirin.openingAmount,
          orionOpeningAmount:shift.CashManagement[0].OrionStars.openingAmount,
        },
      };
    }

    // Check if the latest shift has an open status
    const latestShift = employee.shift[0];
    if (!latestShift.endTime) {
      throw new ForbiddenException('You have a shift already open');
    }

    // If latest shift has closed, create a new shift
    const newShift = await this.prisma.shift.create({
      data: {
        startTime: new Date().toLocaleString(),
        Employee: {
          connect: {
            id: userId,
          },
        }, CashManagement:{
          create:{
            FireKirin:{
              create:{
                openingAmount:dto.fkOpeningAmount,
              }
            },
            OrionStars:{
              create:{
                openingAmount:dto.orionOpeningAmount,
              }
            }
          }
        }
      },
      include:{
        CashManagement:{
          include:{
            FireKirin:true,
            OrionStars:true
          }
        }
      }
    });

    return {
      status: 'success',
      data: {
        shiftId: newShift.id,
        openingTime: newShift.startTime,
        employeeName: employee.name,
        fkOpeningAmount:newShift.CashManagement[0].FireKirin.openingAmount,
        orionOpeningAmount:newShift.CashManagement[0].OrionStars.openingAmount,
      },
    };
  }

  async closeShift(userId: string) {
    const employee = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        shift: {
          orderBy: {
            startTime: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (!employee.shift || employee.shift.length === 0) {
      throw new ForbiddenException('You have no shifts opened to close');
    }

    console.log(employee.shift[0]);
    // Check if the latest shift has an open status
    const latestShift = employee.shift[0];
    if (latestShift.endTime) {
      throw new ForbiddenException('You have no shifts opened to close');
    }

    const closedShift = await this.prisma.shift.update({
      where: {
        id: latestShift.id,
      },
      data: {
        endTime: new Date().toLocaleString(),
      },
    });

    return {
      status: 'success',
      data: {
        shiftId: closedShift.id,
        closingTime: closedShift.endTime,
      },
    };
  }

  async getAllShifts() {
    return await this.prisma.shift.findMany({
      where: {
        endTime: {
          not: null,
        },
      },
      orderBy: {
        startTime: 'desc',
      },
      include: {
        Employee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getCurrentShift(userId: string) {
    const shift = await this.prisma.shift.findFirst({
      where: {
        employeeId: userId,
        endTime: null,
      },
      orderBy: {
        startTime: 'desc',
      },
      include: {
        Employee: true,
        CashManagement: true
      },
    });
    if (!shift) {
      throw new NotFoundException('You have no open shift currently');
    }
    return {
      status: 'success',
      data: shift,
    };
  }

  async cashInOut(userId: string, shiftId: string, dto: TransactionDTO) {
    const shift = await this.prisma.shift.findFirst({
      where: {
        id: shiftId,
        employeeId: userId,
        endTime: null,
      },
    });
    if (!shift) {
      throw new NotFoundException('You have no open shift currently');
    }
    const findPlayer = await this.prisma.player.findFirst({
      where: {
        id: dto.playerId,
      },
    });
    if (!findPlayer) {
      throw new NotFoundException('Player not found');
    }
    // const findGame = await this.prisma.game.findFirst({
    //   where: {
    //     id: "TODO",
    //   },
    // });
    // if (!findGame) {
    //   throw new NotFoundException('Game not found');
    // }
    const transaction = await this.prisma.shift.update({
      where: {
        id: shiftId,
      },
      data: {},
    });
    return transaction;
  }

  async getCurrentShiftTransactions(userId: string) {
    const shift = await this.prisma.shift.findFirst({
      where: {
        employeeId: userId,
        endTime: null,
      },
    });
    if (!shift) {
      throw new NotFoundException('You have no open shift currently');
    }
    return shift;
  }
}
