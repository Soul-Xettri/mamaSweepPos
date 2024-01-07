import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { GetCurrentUserId, Roles } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/common/guards';

@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post('shift-in')
  openShift(@GetCurrentUserId() userId: string) {
    return this.shiftService.openShift(userId);
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
}
