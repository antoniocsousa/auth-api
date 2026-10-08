import { Body, Controller, Cookies, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignUpDto, SignInDto } from './auth.dto.js';
import { HttpAdapterHost } from '@nestjs/core';
import { Public } from './dacorators/public.decorator.js';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adapterHost: HttpAdapterHost
  ) {}

  @Post('/signup')
  async signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Res({passthrough: true}) res: unknown,
    @Body() data: SignInDto
  ) {
    const response = await this.authService.signIn(data);

    this.adapterHost.httpAdapter.setCookie(res, 'refreshToken', response.refreshToken, {
      httpOnly: true,
    })

    return { accessToken: response.accessToken }
  }

  @Post('/refresh-token')
  async refresh(@Cookies('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
}
