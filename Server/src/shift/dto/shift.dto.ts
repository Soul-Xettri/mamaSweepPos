import { TransactionType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ShiftDTO{
  @IsNotEmpty()
  @IsNumber()
  fkOpeningAmount: number;

  @IsNotEmpty()
  @IsNumber()
  orionOpeningAmount: number;

  @IsOptional()
  @IsNumber()
  closeAmount: number;
}
export class TransactionDTO {
  @IsNotEmpty()
  @IsEnum(TransactionType, { each: true })
  transactionType: TransactionType;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  bonus: number;

  @IsOptional()
  @IsNumber()
  tip: number;

  @IsNotEmpty()
  total: number;

  @IsString()
  playerId : string;

  
}
