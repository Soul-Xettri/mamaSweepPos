import { TransactionType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @IsString()
  gameId : string;
}
