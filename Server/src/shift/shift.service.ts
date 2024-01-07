import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
        where:{
            employeeId: userId,
            endTime: null,
        },
        orderBy: {
            startTime: 'desc',
          },
    })
    if(!shift){
        throw new NotFoundException("You have no open shift currently")
    }
    return shift;
  }
}
