import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.user({ id });
  }

  @Post()
  async createOne(@Body() data: Prisma.UserCreateInput) {
    return this.userService.createUser(data);
  }

  @Put('/:id')
  async updateOne(
    @Body() data: Prisma.UserUpdateInput,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.userService.updateUser({ data, where: {id} });
  }

  @Delete('/:id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser({ id })
  }
}
