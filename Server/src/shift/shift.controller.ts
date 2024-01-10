import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { GetCurrentUserId, Roles } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/common/guards';
import { ShiftDTO, TransactionDTO } from './dto/shift.dto';

@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post('shift-in')
  openShift(@GetCurrentUserId() userId: string, @Body() dto: ShiftDTO) {
    return this.shiftService.openShift(userId, dto);
  }

  @Post('shift-out')
  closeShift(@GetCurrentUserId() userId: string) {
    return this.shiftService.closeShift(userId);
  }

  @Get('')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  getAllShifts() {
    return this.shiftService.getAllShifts();
  }

  @Get('current')
  getCurrentShift(@GetCurrentUserId() userId: string) {
    return this.shiftService.getCurrentShift(userId);
  }

  @Post('cashManagement/:shiftId/player/:playerId')
  cashInOut(
    @Param('shiftId') shiftId: string,
    @Param('playerId') playerId: string,
    @GetCurrentUserId() userId: string,
    @Body() dto: TransactionDTO,
  ) {
    return this.shiftService.cashInOut(userId, shiftId, playerId, dto);
  }

  @Get('current/transactions')
  getCurrentShiftTransactions(@GetCurrentUserId() userId: string) {
    return this.shiftService.getCurrentShiftTransactions(userId);
  }

}
