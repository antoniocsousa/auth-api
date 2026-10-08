import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { Prisma, User } from '../generated/prisma/client.js';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async user(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
        return this.prisma.user.findUnique({ where });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({ data });
    }

    async updateUser(params: {
        data: Prisma.UserUpdateInput,
        where: Prisma.UserWhereUniqueInput
    }): Promise<User> {
        const where = params.where;
        const user = await this.prisma.user.findUnique({ where });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.prisma.user.update(params);
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
        const user = await this.prisma.user.findUnique({ where });

        if (!user) {
            throw new NotFoundException('User not found');
        }
        
        return this.prisma.user.delete({ where });
    }
}
