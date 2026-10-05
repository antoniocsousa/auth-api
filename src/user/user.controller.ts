import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserService } from './user.service.js';
import { Prisma } from '../generated/prisma/client.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.user({ id });
  }

  @Post()
  async createOne(@Body() data: Prisma.UserCreateInput) {
    return this.userService.createUser(data);
  }

  @Delete('/:id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser({ id })
  }
}
