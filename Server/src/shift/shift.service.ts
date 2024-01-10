import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GameType, TransactionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShiftDTO, TransactionDTO } from './dto/shift.dto';

@Injectable()
export class ShiftService {
  constructor(private prisma: PrismaService) {}

  async openShift(userId: string, dto: ShiftDTO) {
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
          CashManagement: {
            create: {
              FireKirin: {
                create: {
                  openingBalance: dto.fkOpeningBalance,
                  expectedBalance: dto.fkOpeningBalance,
                },
              },
              OrionStars: {
                create: {
                  openingBalance: dto.orionOpeningBalance,
                  expectedBalance: dto.orionOpeningBalance,
                },
              },
              GameVault: {
                create: {
                  openingBalance: dto.gvOpeningBalance,
                  expectedBalance: dto.gvOpeningBalance,
                },
              },
              PandaMaster: {
                create: {
                  openingBalance: dto.pmOpeningBalance,
                  expectedBalance: dto.pmOpeningBalance,
                },
              },
              UltraPanda: {
                create: {
                  openingBalance: dto.upOpeningBalance,
                  expectedBalance: dto.upOpeningBalance,
                },
              },
              VbLink: {
                create: {
                  openingBalance: dto.vbOpeningBalance,
                  expectedBalance: dto.vbOpeningBalance,
                },
              },
              MilkyWay: {
                create: {
                  openingBalance: dto.milkyOpeningBalance,
                  expectedBalance: dto.milkyOpeningBalance,
                },
              },
              Juwa: {
                create: {
                  openingBalance: dto.juwaOpeningBalance,
                  expectedBalance: dto.juwaOpeningBalance,
                },
              },
            },
          },
        },
        include: {
          CashManagement: {
            include: {
              FireKirin: true,
              OrionStars: true,
              GameVault: true,
              PandaMaster: true,
              UltraPanda: true,
              VbLink: true,
              MilkyWay: true,
              Juwa: true,
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
          fkOpeningBalance: shift.CashManagement[0].FireKirin.openingBalance,
          orionOpeningBalance:
            shift.CashManagement[0].OrionStars.openingBalance,
          gvOpeningBalance: shift.CashManagement[0].GameVault.openingBalance,
          pmOpeningBalance: shift.CashManagement[0].PandaMaster.openingBalance,
          upOpeningBalance: shift.CashManagement[0].UltraPanda.openingBalance,
          vbOpeningBalance: shift.CashManagement[0].VbLink.openingBalance,
          milkyOpeningBalance: shift.CashManagement[0].MilkyWay.openingBalance,
          juwaOpeningBalance: shift.CashManagement[0].Juwa.openingBalance,
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
        },
        CashManagement: {
          create: {
            FireKirin: {
              create: {
                openingBalance: dto.fkOpeningBalance,
                expectedBalance: dto.fkOpeningBalance,
              },
            },
            OrionStars: {
              create: {
                openingBalance: dto.orionOpeningBalance,
                expectedBalance: dto.orionOpeningBalance,
              },
            },
            GameVault: {
              create: {
                openingBalance: dto.gvOpeningBalance,
                expectedBalance: dto.gvOpeningBalance,
              },
            },
            PandaMaster: {
              create: {
                openingBalance: dto.pmOpeningBalance,
                expectedBalance: dto.pmOpeningBalance,
              },
            },
            UltraPanda: {
              create: {
                openingBalance: dto.upOpeningBalance,
                expectedBalance: dto.upOpeningBalance,
              },
            },
            VbLink: {
              create: {
                openingBalance: dto.vbOpeningBalance,
                expectedBalance: dto.vbOpeningBalance,
              },
            },
            MilkyWay: {
              create: {
                openingBalance: dto.milkyOpeningBalance,
                expectedBalance: dto.milkyOpeningBalance,
              },
            },
            Juwa: {
              create: {
                openingBalance: dto.juwaOpeningBalance,
                expectedBalance: dto.juwaOpeningBalance,
              },
            },
          },
        },
      },
      include: {
        CashManagement: {
          include: {
            FireKirin: true,
            OrionStars: true,
            GameVault: true,
            PandaMaster: true,
            UltraPanda: true,
            VbLink: true,
            MilkyWay: true,
            Juwa: true,
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
        fkOpeningBalance: newShift.CashManagement[0].FireKirin.openingBalance,
        orionOpeningBalance:
          newShift.CashManagement[0].OrionStars.openingBalance,
        gvOpeningBalance: newShift.CashManagement[0].GameVault.openingBalance,
        pmOpeningBalance: newShift.CashManagement[0].PandaMaster.openingBalance,
        upOpeningBalance: newShift.CashManagement[0].UltraPanda.openingBalance,
        vbOpeningBalance: newShift.CashManagement[0].VbLink.openingBalance,
        milkyOpeningBalance: newShift.CashManagement[0].MilkyWay.openingBalance,
        juwaOpeningBalance: newShift.CashManagement[0].Juwa.openingBalance,
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
      include: {
        CashManagement: {
          include: {
            FireKirin: {
              include: {
                Transaction: true,
              },
            },
            OrionStars: {
              include: {
                Transaction: true,
              },
            },
            GameVault: {
              include: {
                Transaction: true,
              },
            },
            PandaMaster: {
              include: {
                Transaction: true,
              },
            },
            UltraPanda: {
              include: {
                Transaction: true,
              },
            },
            VbLink: {
              include: {
                Transaction: true,
              },
            },
            MilkyWay: {
              include: {
                Transaction: true,
              },
            },
            Juwa: {
              include: {
                Transaction: true,
              },
            },
          },
        },
      },
    });

    const getFkCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.FIRE_KIRIN,
        FireKirin: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getFkCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.FIRE_KIRIN,
        FireKirin: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const fkCashIN = getFkCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const fkBonus = getFkCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const fkCashOUT = getFkCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const fkTip = getFkCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    const getOrionCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.ORION_STARS,
        OrionStars: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getOrionCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.ORION_STARS,
        OrionStars: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const orionCashIn = getOrionCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const orionBonus = getOrionCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const orionCashOut = getOrionCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const orionTip = getOrionCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    const getGvCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.GAME_VAULT,
        GameVault: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getGvCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.GAME_VAULT,
        GameVault: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const gvCashIn = getGvCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const gvBonus = getGvCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const gvCashOut = getGvCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const gvTip = getGvCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    const getPmCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.PANDA_MASTER,
        PandaMaster: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getPmCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.PANDA_MASTER,
        PandaMaster: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const pmCashIn = getPmCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const pmBonus = getPmCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const pmCashOut = getPmCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const pmTip = getPmCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    const getUpCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.ULTRA_PANDA,
        UltraPanda: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getUpCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.ULTRA_PANDA,
        UltraPanda: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const upCashIn = getUpCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const upBonus = getUpCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const upCashOut = getUpCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const upTip = getUpCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    const getVbCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.VB_LINK,
        VbLink: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getVbCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.VB_LINK,
        VbLink: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const vbCashIn = getVbCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const vbBonus = getVbCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const vbCashOut = getVbCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const vbTip = getVbCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    const getMilkyCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.MILKY_WAY,
        MilkyWay: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getMilkyCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.MILKY_WAY,
        MilkyWay: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const milkyCashIn = getMilkyCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const milkyBonus = getMilkyCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const milkyCashOut = getMilkyCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const milkyTip = getMilkyCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    const getJuwaCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.JUWA,
        Juwa: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getJuwaCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.JUWA,
        Juwa: {
          CashManagement: {
            every: {
              shiftId: closedShift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const juwaCashIn = getJuwaCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const juwaBonus = getJuwaCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const juwaCashOut = getJuwaCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const juwaTip = getJuwaCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    return {
      status: 'success',
      data: {
        shiftId: closedShift.id,
        employeeName: employee.name,
        openingTime: closedShift.startTime,
        closingTime: 'You have not closed your shift yet',
        fire_Kirin: {
          fkOpeningBalance:
            closedShift.CashManagement[0].FireKirin.openingBalance,
          fkCashIN: fkCashIN,
          fkBonus: fkBonus,
          fkTip: fkTip,
          fkCashOUT: fkCashOUT,
          fkExpectedBalance:
            closedShift.CashManagement[0].FireKirin.expectedBalance,
        },
        orion_Stars: {
          orionOpeningBalance:
            closedShift.CashManagement[0].OrionStars.openingBalance,
          orionCashIn: orionCashIn,
          orionBonus: orionBonus,
          orionTip: orionTip,
          orionCashInOut: orionCashOut,
          orionExpectedBalance:
            closedShift.CashManagement[0].OrionStars.expectedBalance,
        },
        game_Vault: {
          gvOpeningBalance:
            closedShift.CashManagement[0].GameVault.openingBalance,
          gvCashIn: gvCashIn,
          gvBonus: gvBonus,
          gvTip: gvTip,
          gvCashOut: gvCashOut,
          gvExpectedBalance:
            closedShift.CashManagement[0].GameVault.expectedBalance,
        },
        panda_Master: {
          pmOpeningBalance:
            closedShift.CashManagement[0].PandaMaster.openingBalance,
          pmCashIn: pmCashIn,
          pmBonus: pmBonus,
          pmTip: pmTip,
          pmCashOut: pmCashOut,
          pmExpectedBalance:
            closedShift.CashManagement[0].PandaMaster.expectedBalance,
        },
        ultra_Panda: {
          upOpeningBalance:
            closedShift.CashManagement[0].UltraPanda.openingBalance,
          upCashIn: upCashIn,
          upBonus: upBonus,
          upTip: upTip,
          upCashOut: upCashOut,
          upExpectedBalance:
            closedShift.CashManagement[0].UltraPanda.expectedBalance,
        },
        vb_Link: {
          vbOpeningBalance: closedShift.CashManagement[0].VbLink.openingBalance,
          vbCashIn: vbCashIn,
          vbBonus: vbBonus,
          vbTip: vbTip,
          vbCashOut: vbCashOut,
          vbExpectedBalance:
            closedShift.CashManagement[0].VbLink.expectedBalance,
        },
        milky_Way: {
          milkyOpeningBalance:
            closedShift.CashManagement[0].MilkyWay.openingBalance,
          milkyCashIn: milkyCashIn,
          milkyBonus: milkyBonus,
          milkyTip: milkyTip,
          milkyCashOut: milkyCashOut,
          milkyExpectedBalance:
            closedShift.CashManagement[0].MilkyWay.expectedBalance,
        },
        juwa: {
          juwaOpeningBalance: closedShift.CashManagement[0].Juwa.openingBalance,
          juwaCashIn: juwaCashIn,
          juwaBonus: juwaBonus,
          juwaTip: juwaTip,
          juwaCashOut: juwaCashOut,
          juwaExpectedBalance:
            closedShift.CashManagement[0].Juwa.expectedBalance,
        },
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
        CashManagement: {
          include: {
            FireKirin: {
              include: {
                Transaction: true,
              },
            },
            OrionStars: {
              include: {
                Transaction: true,
              },
            },
            GameVault: {
              include: {
                Transaction: true,
              },
            },
            PandaMaster: {
              include: {
                Transaction: true,
              },
            },
            UltraPanda: {
              include: {
                Transaction: true,
              },
            },
            VbLink: {
              include: {
                Transaction: true,
              },
            },
            MilkyWay: {
              include: {
                Transaction: true,
              },
            },
            Juwa: {
              include: {
                Transaction: true,
              },
            },
          },
        },
      },
    });
    if (!shift) {
      throw new NotFoundException('You have no open shift currently');
    }
    const getFkCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.FIRE_KIRIN,
        FireKirin: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getFkCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.FIRE_KIRIN,
        FireKirin: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const fkCashIN = getFkCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const fkBonus = getFkCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const fkCashOUT = getFkCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const fkTip = getFkCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    const getOrionCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.ORION_STARS,
        OrionStars: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getOrionCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.ORION_STARS,
        OrionStars: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const orionCashIn = getOrionCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const orionBonus = getOrionCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const orionCashOut = getOrionCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const orionTip = getOrionCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    const getGvCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.GAME_VAULT,
        GameVault: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getGvCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.GAME_VAULT,
        GameVault: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const gvCashIn = getGvCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const gvBonus = getGvCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const gvCashOut = getGvCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const gvTip = getGvCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    const getPmCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.PANDA_MASTER,
        PandaMaster: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getPmCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.PANDA_MASTER,
        PandaMaster: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const pmCashIn = getPmCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const pmBonus = getPmCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const pmCashOut = getPmCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const pmTip = getPmCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    const getUpCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.ULTRA_PANDA,
        UltraPanda: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getUpCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.ULTRA_PANDA,
        UltraPanda: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const upCashIn = getUpCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const upBonus = getUpCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const upCashOut = getUpCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const upTip = getUpCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    const getVbCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.VB_LINK,
        VbLink: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getVbCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.VB_LINK,
        VbLink: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const vbCashIn = getVbCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const vbBonus = getVbCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const vbCashOut = getVbCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const vbTip = getVbCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    const getMilkyCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.MILKY_WAY,
        MilkyWay: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getMilkyCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.MILKY_WAY,
        MilkyWay: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const milkyCashIn = getMilkyCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const milkyBonus = getMilkyCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const milkyCashOut = getMilkyCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const milkyTip = getMilkyCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    const getJuwaCashIn = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_IN || TransactionType.FREE_PLAY,
        TransactionFor: GameType.JUWA,
        Juwa: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        bonus: true,
      },
    });
    const getJuwaCashOut = await this.prisma.transaction.findMany({
      where: {
        TransactionType: TransactionType.CASH_OUT,
        TransactionFor: GameType.JUWA,
        Juwa: {
          CashManagement: {
            every: {
              shiftId: shift.id,
            },
          },
        },
      },
      select: {
        amount: true,
        tip: true,
      },
    });
    const juwaCashIn = getJuwaCashIn
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const juwaBonus = getJuwaCashIn
      .map((item) => item.bonus)
      .reduce((a, b) => a + b, 0);
    const juwaCashOut = getJuwaCashOut
      .map((item) => item.amount)
      .reduce((a, b) => a + b, 0);
    const juwaTip = getJuwaCashOut
      .map((item) => item.tip)
      .reduce((a, b) => a + b, 0);

    return {
      status: 'success',
      data: {
        shiftId: shift.id,
        employeeName: shift.Employee.name,
        openingTime: shift.startTime,
        closingTime: 'You have not closed your shift yet',
        fire_Kirin: {
          fkOpeningBalance: shift.CashManagement[0].FireKirin.openingBalance,
          fkCashIN: fkCashIN,
          fkBonus: fkBonus,
          fkTip: fkTip,
          fkCashOUT: fkCashOUT,
          fkExpectedBalance: shift.CashManagement[0].FireKirin.expectedBalance,
        },
        orion_Stars: {
          orionOpeningBalance:
            shift.CashManagement[0].OrionStars.openingBalance,
          orionCashIn: orionCashIn,
          orionBonus: orionBonus,
          orionTip: orionTip,
          orionCashInOut: orionCashOut,
          orionExpectedBalance:
            shift.CashManagement[0].OrionStars.expectedBalance,
        },
        game_Vault: {
          gvOpeningBalance: shift.CashManagement[0].GameVault.openingBalance,
          gvCashIn: gvCashIn,
          gvBonus: gvBonus,
          gvTip: gvTip,
          gvCashOut: gvCashOut,
          gvExpectedBalance: shift.CashManagement[0].GameVault.expectedBalance,
        },
        panda_Master: {
          pmOpeningBalance: shift.CashManagement[0].PandaMaster.openingBalance,
          pmCashIn: pmCashIn,
          pmBonus: pmBonus,
          pmTip: pmTip,
          pmCashOut: pmCashOut,
          pmExpectedBalance:
            shift.CashManagement[0].PandaMaster.expectedBalance,
        },
        ultra_Panda: {
          upOpeningBalance: shift.CashManagement[0].UltraPanda.openingBalance,
          upCashIn: upCashIn,
          upBonus: upBonus,
          upTip: upTip,
          upCashOut: upCashOut,
          upExpectedBalance: shift.CashManagement[0].UltraPanda.expectedBalance,
        },
        vb_Link: {
          vbOpeningBalance: shift.CashManagement[0].VbLink.openingBalance,
          vbCashIn: vbCashIn,
          vbBonus: vbBonus,
          vbTip: vbTip,
          vbCashOut: vbCashOut,
          vbExpectedBalance: shift.CashManagement[0].VbLink.expectedBalance,
        },
        milky_Way: {
          milkyOpeningBalance: shift.CashManagement[0].MilkyWay.openingBalance,
          milkyCashIn: milkyCashIn,
          milkyBonus: milkyBonus,
          milkyTip: milkyTip,
          milkyCashOut: milkyCashOut,
          milkyExpectedBalance:
            shift.CashManagement[0].MilkyWay.expectedBalance,
        },
        juwa: {
          juwaOpeningBalance: shift.CashManagement[0].Juwa.openingBalance,
          juwaCashIn: juwaCashIn,
          juwaBonus: juwaBonus,
          juwaTip: juwaTip,
          juwaCashOut: juwaCashOut,
          juwaExpectedBalance: shift.CashManagement[0].Juwa.expectedBalance,
        },
      },
    };
  }

  async cashInOut(
    userId: string,
    shiftId: string,
    playerId: string,
    dto: TransactionDTO,
  ) {
    const shift = await this.prisma.shift.findFirst({
      where: {
        id: shiftId,
        employeeId: userId,
        endTime: null,
      },
      include: {
        Employee: true,
      },
    });
    if (!shift) {
      throw new NotFoundException('You have no open shift currently');
    }
    const findPlayer = await this.prisma.player.findFirst({
      where: {
        id: playerId,
      },
    });
    if (!findPlayer) {
      throw new NotFoundException('Player not found');
    }
    let total = 0;
    let exceptedBalance = 0;
    let tip = dto.tip;
    let bonus = dto.bonus;
    if (
      dto.transactionType === TransactionType.CASH_IN ||
      TransactionType.FREE_PLAY
    ) {
      (total = dto.amount + dto.bonus),
        (exceptedBalance = -total),
        (tip = 0),
        (bonus = dto.bonus);
    }
    if (dto.transactionType === TransactionType.CASH_OUT) {
      (total = dto.amount - dto.tip),
        (exceptedBalance = total),
        (bonus = 0),
        (tip = dto.tip);
    }
    if (dto.transactionFor === GameType.FIRE_KIRIN) {
      await this.prisma.player.update({
        where: {
          id: playerId,
        },
        data: {
          fireKirin: true,
        },
      });
      await this.prisma.cashManagement.update({
        where: {
          shiftId: shiftId,
        },
        data: {
          FireKirin: {
            update: {
              expectedBalance: {
                increment: exceptedBalance,
              },
              Transaction: {
                create: {
                  TransactionType: dto.transactionType,
                  TransactionFor: dto.transactionFor,
                  amount: dto.amount,
                  bonus: bonus,
                  tip: tip,
                  totalAmount: total,
                  note: dto.note,
                  createdBy: userId,
                  Shift: {
                    connect: {
                      id: shiftId,
                    },
                  },
                  Player: {
                    connect: {
                      id: playerId,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          FireKirin: {
            include: {
              Transaction: {
                include: {
                  Player: true,
                },
              },
            },
          },
        },
      });
      return {
        status: 'success',
        data: {
          userId: userId,
          shiftId: shiftId,
          employeeName: shift.Employee.name,
          playerName: findPlayer.name,
          transactionFor: dto.transactionFor,
          transactionAdded: {
            transactionType: dto.transactionType,
            note: dto.note,
            amount: dto.amount,
            bonus: bonus,
            tip: tip,
            totalAmount: total,
          },
        },
      };
    }
    if (dto.transactionFor === GameType.ORION_STARS) {
      await this.prisma.player.update({
        where: {
          id: playerId,
        },
        data: {
          orionStars: true,
        },
      });
      await this.prisma.cashManagement.update({
        where: {
          shiftId: shiftId,
        },
        data: {
          OrionStars: {
            update: {
              expectedBalance: {
                increment: exceptedBalance,
              },
              Transaction: {
                create: {
                  TransactionType: dto.transactionType,
                  TransactionFor: dto.transactionFor,
                  amount: dto.amount,
                  bonus: bonus,
                  tip: tip,
                  totalAmount: total,
                  note: dto.note,
                  createdBy: userId,
                  Shift: {
                    connect: {
                      id: shiftId,
                    },
                  },
                  Player: {
                    connect: {
                      id: playerId,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          OrionStars: {
            include: {
              Transaction: {
                include: {
                  Player: true,
                },
              },
            },
          },
        },
      });
      return {
        status: 'success',
        data: {
          userId: userId,
          shiftId: shiftId,
          employeeName: shift.Employee.name,
          playerName: findPlayer.name,
          transactionFor: dto.transactionFor,
          transactionAdded: {
            transactionType: dto.transactionType,
            note: dto.note,
            amount: dto.amount,
            bonus: bonus,
            tip: tip,
            totalAmount: total,
          },
        },
      };
    }
    if (dto.transactionFor === GameType.GAME_VAULT) {
      await this.prisma.player.update({
        where: {
          id: playerId,
        },
        data: {
          gameVault: true,
        },
      });
      await this.prisma.cashManagement.update({
        where: {
          shiftId: shiftId,
        },
        data: {
          GameVault: {
            update: {
              expectedBalance: {
                increment: exceptedBalance,
              },
              Transaction: {
                create: {
                  TransactionType: dto.transactionType,
                  TransactionFor: dto.transactionFor,
                  amount: dto.amount,
                  bonus: bonus,
                  tip: tip,
                  totalAmount: total,
                  note: dto.note,
                  createdBy: userId,
                  Shift: {
                    connect: {
                      id: shiftId,
                    },
                  },
                  Player: {
                    connect: {
                      id: playerId,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          GameVault: {
            include: {
              Transaction: {
                include: {
                  Player: true,
                },
              },
            },
          },
        },
      });
      return {
        status: 'success',
        data: {
          userId: userId,
          shiftId: shiftId,
          employeeName: shift.Employee.name,
          playerName: findPlayer.name,
          transactionFor: dto.transactionFor,
          transactionAdded: {
            transactionType: dto.transactionType,
            note: dto.note,
            amount: dto.amount,
            bonus: bonus,
            tip: tip,
            totalAmount: total,
          },
        },
      };
    }
    if (dto.transactionFor === GameType.PANDA_MASTER) {
      await this.prisma.player.update({
        where: {
          id: playerId,
        },
        data: {
          pandaMaster: true,
        },
      });
      await this.prisma.cashManagement.update({
        where: {
          shiftId: shiftId,
        },
        data: {
          PandaMaster: {
            update: {
              expectedBalance: {
                increment: exceptedBalance,
              },
              Transaction: {
                create: {
                  TransactionType: dto.transactionType,
                  TransactionFor: dto.transactionFor,
                  amount: dto.amount,
                  bonus: bonus,
                  tip: tip,
                  totalAmount: total,
                  note: dto.note,
                  createdBy: userId,
                  Shift: {
                    connect: {
                      id: shiftId,
                    },
                  },
                  Player: {
                    connect: {
                      id: playerId,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          PandaMaster: {
            include: {
              Transaction: {
                include: {
                  Player: true,
                },
              },
            },
          },
        },
      });
      return {
        status: 'success',
        data: {
          userId: userId,
          shiftId: shiftId,
          employeeName: shift.Employee.name,
          playerName: findPlayer.name,
          transactionFor: dto.transactionFor,
          transactionAdded: {
            transactionType: dto.transactionType,
            note: dto.note,
            amount: dto.amount,
            bonus: bonus,
            tip: tip,
            totalAmount: total,
          },
        },
      };
    }
    if (dto.transactionFor === GameType.ULTRA_PANDA) {
      await this.prisma.player.update({
        where: {
          id: playerId,
        },
        data: {
          ultraPanda: true,
        },
      });
      await this.prisma.cashManagement.update({
        where: {
          shiftId: shiftId,
        },
        data: {
          UltraPanda: {
            update: {
              expectedBalance: {
                increment: exceptedBalance,
              },
              Transaction: {
                create: {
                  TransactionType: dto.transactionType,
                  TransactionFor: dto.transactionFor,
                  amount: dto.amount,
                  bonus: bonus,
                  tip: tip,
                  totalAmount: total,
                  note: dto.note,
                  createdBy: userId,
                  Shift: {
                    connect: {
                      id: shiftId,
                    },
                  },
                  Player: {
                    connect: {
                      id: playerId,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          UltraPanda: {
            include: {
              Transaction: {
                include: {
                  Player: true,
                },
              },
            },
          },
        },
      });
      return {
        status: 'success',
        data: {
          userId: userId,
          shiftId: shiftId,
          employeeName: shift.Employee.name,
          playerName: findPlayer.name,
          transactionFor: dto.transactionFor,
          transactionAdded: {
            transactionType: dto.transactionType,
            note: dto.note,
            amount: dto.amount,
            bonus: bonus,
            tip: tip,
            totalAmount: total,
          },
        },
      };
    }
    if (dto.transactionFor === GameType.VB_LINK) {
      await this.prisma.player.update({
        where: {
          id: playerId,
        },
        data: {
          vbLink: true,
        },
      });
      await this.prisma.cashManagement.update({
        where: {
          shiftId: shiftId,
        },
        data: {
          VbLink: {
            update: {
              expectedBalance: {
                increment: exceptedBalance,
              },
              Transaction: {
                create: {
                  TransactionType: dto.transactionType,
                  TransactionFor: dto.transactionFor,
                  amount: dto.amount,
                  bonus: bonus,
                  tip: tip,
                  totalAmount: total,
                  note: dto.note,
                  createdBy: userId,
                  Shift: {
                    connect: {
                      id: shiftId,
                    },
                  },
                  Player: {
                    connect: {
                      id: playerId,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          VbLink: {
            include: {
              Transaction: {
                include: {
                  Player: true,
                },
              },
            },
          },
        },
      });
      return {
        status: 'success',
        data: {
          userId: userId,
          shiftId: shiftId,
          employeeName: shift.Employee.name,
          playerName: findPlayer.name,
          transactionFor: dto.transactionFor,
          transactionAdded: {
            transactionType: dto.transactionType,
            note: dto.note,
            amount: dto.amount,
            bonus: bonus,
            tip: tip,
            totalAmount: total,
          },
        },
      };
    }
    if (dto.transactionFor === GameType.MILKY_WAY) {
      await this.prisma.player.update({
        where: {
          id: playerId,
        },
        data: {
          milkyWay: true,
        },
      });
      await this.prisma.cashManagement.update({
        where: {
          shiftId: shiftId,
        },
        data: {
          MilkyWay: {
            update: {
              expectedBalance: {
                increment: exceptedBalance,
              },
              Transaction: {
                create: {
                  TransactionType: dto.transactionType,
                  TransactionFor: dto.transactionFor,
                  amount: dto.amount,
                  bonus: bonus,
                  tip: tip,
                  totalAmount: total,
                  note: dto.note,
                  createdBy: userId,
                  Shift: {
                    connect: {
                      id: shiftId,
                    },
                  },
                  Player: {
                    connect: {
                      id: playerId,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          MilkyWay: {
            include: {
              Transaction: {
                include: {
                  Player: true,
                },
              },
            },
          },
        },
      });
      return {
        status: 'success',
        data: {
          userId: userId,
          shiftId: shiftId,
          employeeName: shift.Employee.name,
          playerName: findPlayer.name,
          transactionFor: dto.transactionFor,
          transactionAdded: {
            transactionType: dto.transactionType,
            note: dto.note,
            amount: dto.amount,
            bonus: bonus,
            tip: tip,
            totalAmount: total,
          },
        },
      };
    }
    if (dto.transactionFor === GameType.JUWA) {
      await this.prisma.player.update({
        where: {
          id: playerId,
        },
        data: {
          juwa: true,
        },
      });
      await this.prisma.cashManagement.update({
        where: {
          shiftId: shiftId,
        },
        data: {
          Juwa: {
            update: {
              expectedBalance: {
                increment: exceptedBalance,
              },
              Transaction: {
                create: {
                  TransactionType: dto.transactionType,
                  TransactionFor: dto.transactionFor,
                  amount: dto.amount,
                  bonus: bonus,
                  tip: tip,
                  totalAmount: total,
                  note: dto.note,
                  createdBy: userId,
                  Shift: {
                    connect: {
                      id: shiftId,
                    },
                  },
                  Player: {
                    connect: {
                      id: playerId,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          Juwa: {
            include: {
              Transaction: {
                include: {
                  Player: true,
                },
              },
            },
          },
        },
      });
      return {
        status: 'success',
        data: {
          userId: userId,
          shiftId: shiftId,
          employeeName: shift.Employee.name,
          playerName: findPlayer.name,
          transactionFor: dto.transactionFor,
          transactionAdded: {
            transactionType: dto.transactionType,
            note: dto.note,
            amount: dto.amount,
            bonus: bonus,
            tip: tip,
            totalAmount: total,
          },
        },
      };
    }
  }

  async getCurrentShiftTransactions(userId: string) {
    const shift = await this.prisma.shift.findFirst({
      where: {
        employeeId: userId,
        endTime: null,
      },
      include: {
        Employee: true,
      },
    });
    if (!shift) {
      throw new NotFoundException('You have no open shift currently');
    }
    const transactions = await this.prisma.transaction.findMany({
      where: {
        shiftId: shift.id,
      },
      select: {
        TransactionType: true,
        TransactionFor: true,
        amount: true,
        bonus: true,
        tip: true,
        totalAmount: true,
        note: true,
      },
    });
    return {
      status: 'success',
      data: {
        userId: userId,
        shiftId: shift.id,
        employeeName: shift.Employee.name,
        transactions: transactions,
      },
    };
  }
}
