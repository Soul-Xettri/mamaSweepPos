import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards/at.guard';
import { PrismaModule } from './prisma/prisma.module';
import { UserCheckGuard } from './common/guards';
import { ConfigModule } from '@nestjs/config';
import { ShiftModule } from './shift/shift.module';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    AuthModule,
    ShiftModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserCheckGuard,
    },
  ],
})
export class AppModule {}
