import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    JwtModule
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
  }]
})
export class AppModule {}
