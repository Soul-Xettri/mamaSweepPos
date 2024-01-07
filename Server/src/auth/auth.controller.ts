import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
  Roles,
} from 'src/common/decorators';
import {
  ChangeRoleDTO,
  ResetPasswordDTO,
  SignInDto,
  SignUpDto,
} from './dto/auth.dto';
import { Tokens } from './types';
import { Role } from '@prisma/client';
import { RoleGuard, RtGuard } from 'src/common/guards';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signIn')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Tokens> {
    const tokens = await this.authService.signIn(dto, response);
    response.cookie('access_token', tokens.access_token, {
      sameSite: 'none',
      secure: process.env.PRODUCTION === 'true' ? true : false,
      httpOnly: process.env.httpOnly ? true : false,
      expires: new Date(Date.now() + 3600 * 1000 * 24 * 180),
    });
    response.cookie('refresh_token', tokens.access_token, {
      sameSite: 'none',
      secure: process.env.PRODUCTION === 'true' ? true : false,
      httpOnly: process.env.httpOnly ? true : false,
      expires: new Date(Date.now() + 3600 * 1000 * 24 * 180),
    });
    return tokens;
  }

  @Post('employee')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  addEmployee(
    @Body() dto: SignUpDto,
    @GetCurrentUserId() userId: string,
  ): Promise<Tokens> {
    return this.authService.createEmployee(userId, dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.cookie('access_token', '', {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
    return this.authService.logout(userId);
  }

  @Post('reset_password')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  async reset_password(
    @Body() dto: ResetPasswordDTO,
    @GetCurrentUserId() userId: string,
  ) {
    return await this.authService.resetPassword(userId, dto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@GetCurrentUserId() userId: string) {
    return this.authService.getMe(userId);
  }

  // TODO: bug fix this refresh token
  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUser('refreshToken') token: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.authService.refresh(userId, token);
  }

  @Post('role')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  changeRole(@GetCurrentUserId() userId: string, @Body() dto: ChangeRoleDTO) {
    return this.authService.changeRole(userId, dto);
  }
}
