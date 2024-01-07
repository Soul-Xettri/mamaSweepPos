import { Role } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
} from 'class-validator';
import { MatchRole } from 'src/common/validation/Role.Validator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SignInDto extends ResetPasswordDTO {
  @IsString()
  password: string;
}

export class SignUpDto extends SignInDto {
  @IsString()
  name: string;
}

export class ChangeRoleDTO {
  @Validate(MatchRole)
  @IsNotEmpty()
  role: Role;
  @IsString()
  userId: string;
}
