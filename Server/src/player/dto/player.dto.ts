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

  @IsString()
  iGN: string;

  @IsOptional()
  fireKirin: boolean;

  @IsOptional()
  orionStars: boolean;

  @IsOptional()
  gameVault: boolean;

  @IsOptional()
  pandaMaster: boolean;

  @IsOptional()
  ultraPanda: boolean;

  @IsOptional()
  vbLink: boolean;

  @IsOptional()
  milkyWay: boolean;

  @IsOptional()
  juwa: boolean;
}
