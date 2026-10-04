import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserService } from './user.service.js';
import { Prisma } from '../generated/prisma/client.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.user({ id });
  }

  @Post('/signup')
  async createOne(@Body() data: Prisma.UserCreateInput) {
    return this.userService.createUser(data)
  }
}
