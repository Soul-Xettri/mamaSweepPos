import { GameType, TransactionType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ShiftDTO {
  @IsNotEmpty()
  @IsNumber()
  fkOpeningBalance: number;

  @IsOptional()
  @IsNumber()
  fkCloseBalance: number;

  @IsNotEmpty()
  @IsNumber()
  orionOpeningBalance: number;

  @IsOptional()
  @IsNumber()
  orionCloseBalance: number;

  @IsOptional()
  @IsNumber()
  gvOpeningBalance: number;

  @IsOptional()
  @IsNumber()
  gvCloseBalance: number;

  @IsOptional()
  @IsNumber()
  pmOpeningBalance: number;

  @IsOptional()
  @IsNumber()
  pmCloseBalance: number;

  @IsOptional()
  @IsNumber()
  upOpeningBalance: number;

  @IsOptional()
  @IsNumber()
  upCloseBalance: number;

  @IsOptional()
  @IsNumber()
  vbOpeningBalance: number;

  @IsOptional()
  @IsNumber()
  vbCloseBalance: number;

  @IsOptional()
  @IsNumber()
  milkyOpeningBalance: number;

  @IsOptional()
  @IsNumber()
  milkyCloseBalance: number;

  @IsOptional()
  @IsNumber()
  juwaOpeningBalance: number;

  @IsOptional()
  @IsNumber()
  juwaCloseBalance: number;
}
export class TransactionDTO {
  @IsNotEmpty()
  @IsEnum(TransactionType, { each: true })
  transactionType: TransactionType;

  @IsNotEmpty()
  @IsEnum(GameType, { each: true })
  transactionFor: GameType;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  bonus: number;

  @IsOptional()
  @IsNumber()
  tip: number;

  @IsOptional()
  note: string;
}
