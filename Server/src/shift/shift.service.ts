import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionDTO } from './dto/shift.dto';

@Injectable()
export class ShiftService {
  constructor(private prisma: PrismaService) {}

  async openShift(userId: string) {
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
          employee: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return {
        status: 'success',
        data: {
          shiftId: shift.id,
          openingTime: shift.startTime,
          employeeName: employee.name,
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
        employee: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return {
      status: 'success',
      data: {
        shiftId: newShift.id,
        openingTime: newShift.startTime,
        employeeName: employee.name,
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
        employee: {
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
    });
    if (!shift) {
      throw new NotFoundException('You have no open shift currently');
    }
    return shift;
  }

  async cashInOut(
    userId: string,
    shiftId: string,
    dto: TransactionDTO,
  ) {
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
      where:{
        id: dto.playerId,
      }
    });
    if (!findPlayer) {
      throw new NotFoundException('Player not found');
    }
    const findGame = await this.prisma.game.findFirst({
      where:{
        id: dto.gameId,
      }
    });
    if(!findGame){
      throw new NotFoundException('Game not found');
    }
    const transaction = await this.prisma.shift.update({
      where: {
        id: shiftId,
      },
      data: {
        Transaction: {
          create: {
            type: dto.transactionType,
            amount: dto.amount,
            bonus: dto.bonus,
            tip: dto.tip,
            total: dto.total,
            timeStamp: new Date().toLocaleString(),
            Player: {
              connect: {
                id: dto.playerId,
                Game: {
                  some: {
                    id: dto.gameId,
                  },
                },
              },
            },
          },
        },
      },
      include: {
        Transaction: {
          include: {
            Player: {
              include: {
                Game: true,
              },
            },
          },
        },
      },
    });
    return transaction;
  }

  async getCurrentShiftTransactions(userId: string) {
    const shift = await this.prisma.shift.findFirst({
      where: {
        employeeId: userId,
        endTime: null,
      },
      include:{
        Transaction: {
          include:{
            Player: {
              include:{
                Game: true,
              }
            }
          }
        }
      }
    });
    if (!shift) {
      throw new NotFoundException('You have no open shift currently');
    }
    return shift;
  }
}
