import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModule } from '../user/user.module.js';
import { JwtModule } from '@nestjs/jwt';
import "dotenv/config";
import { AuthGuard } from './auth.guard.js';

@Global()
@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET || '',
    signOptions: {
      expiresIn: '15m',
    }
  }), forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard]
})
export class AuthModule {}
