import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ChangeRoleDTO,
  ResetPasswordDTO,
  SignInDto,
  SignUpDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { Tokens } from './types';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createEmployee(userId: string, dto: SignUpDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new ForbiddenException('Please Login again');
      }
      const hash = await this.hashData(dto.password);
      const newEmployee = await this.prisma.user.create({
        data: {
          ...dto,
          password: hash,
          role: Role.EMPLOYEE,
          addedBy: userId,
        },
      });
      const tokens = await this.signToken(
        newEmployee.id,
        newEmployee.email,
        newEmployee.role,
      );
      await this.updateRtHash(newEmployee.id, tokens.refresh_token);
      return tokens;
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new ForbiddenException('User already exists');
      }
    }
  }

  async signIn(dto: SignInDto, response: Response): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('User not found');

    if (user.disabled_by_admin)
      throw new ForbiddenException('User not allowed');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches)
      throw new ForbiddenException("Username or Password didn't match");

    const tokens = await this.signToken(user.id, user.email, user.role);

    response.cookie('token', tokens.access_token, {
      httpOnly: process.env.httpOnly === 'true' ? true : false,
      sameSite: 'none',
      secure: process.env.PRODUCTION === 'true' ? true : false,
    });

    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async resetPassword(userId: string, dto: ResetPasswordDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.disabled_by_admin) {
      throw new ForbiddenException(
        'Could not send email. Please contact admin',
      );
    }
    if (user.role === Role.ADMIN) {
      throw new ForbiddenException('Admin password cannot be reset like this');
    }
    const plainPassword = Math.random().toString(36).substring(2, 10);
    const pwd = await this.hashData(plainPassword);
    await this.prisma.user.update({
      where: {
        email: dto.email,
      },
      data: {
        password: pwd,
        password_reset: true,
        updatedBy: userId,
      },
    });
    return { success: true, newPassword: plainPassword };
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashRt: {
          not: null,
        },
      },
      data: {
        hashRt: null,
      },
    });
    return 'Logged out';
  }

  async changeRole(userId: string, role: ChangeRoleDTO) {
    const userExist = await this.prisma.user.findFirst({
      where: {
        id: role.userId,
      },
    });
    if (!userExist) {
      throw new NotFoundException('User not found');
    }
    if (userExist.role === Role.ADMIN) {
      throw new ForbiddenException('Admin role cannot be changed like this');
    }
    await this.prisma.user.update({
      where: {
        id: userExist.id,
      },
      data: {
        role: role.role,
        updatedBy: userId,
      },
    });
    return { success: true };
  }

  async refresh(userId: string, rt: string) {
    console.log('Entering refresh method with userId:', userId);
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashRt) throw new ForbiddenException('Access denied');

    const rtMatches = await bcrypt.compare(rt, user.hashRt);
    if (!rtMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.signToken(user.id, user.email, user.role);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async signToken(userId: string, email: string, role: Role): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          email,
          role,
        },
        { expiresIn: 60 * 15 * 60, secret: 'at-secret' },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          email,
          role,
        },
        { expiresIn: 60 * 60 * 24 * 7, secret: 'rt-secret' },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashRt: hash,
      },
    });
  }
}
