import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { UserService } from './user.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async getMe(@Req() request: any) {
    return this.userService.me({ id: request.user.sub });
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
