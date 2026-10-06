import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { Prisma, User } from '../generated/prisma/client.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async user(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where });

        if (!user) {
            throw new NotFoundException({ message: 'User not found' });
        }

        return user;
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        const email = data.email;
        const userExists = await this.prisma.user.findUnique({ where: { email } });

        if (userExists) {
            throw new ConflictException({ message: 'Email is already in use' });
        }

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(data.password, salt);

        return this.prisma.user.create({data: { ...data, password: hash }});
    }

    async updateUser(params: {
        data: Prisma.UserUpdateInput,
        where: Prisma.UserWhereUniqueInput
    }): Promise<User> {
        const where = params.where;
        const user = await this.prisma.user.findUnique({ where });

        if (!user) {
            throw new NotFoundException({ message: 'User not found' });
        }

        return this.prisma.user.update(params);
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
        const user = await this.prisma.user.findUnique({ where });

        if (!user) {
            throw new NotFoundException({ message: 'User not found' });
        }
        
        return this.prisma.user.delete({ where });
    }
}
