import { Module } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';

@Module({
  controllers: [ShiftController],
  providers: [ShiftService],
})
export class ShiftModule {}
