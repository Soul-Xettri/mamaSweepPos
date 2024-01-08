import { GameType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PlayerDto {
  @IsString()
  name: string;

  @IsString()
  facebookURL: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  note: string;
  
  @IsNotEmpty()
  @IsEnum(GameType, { each: true })
  gameName: GameType;


  @IsString()
  iGN: string;
}
