import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async user(where: Prisma.UserWhereUniqueInput) {
        return this.prisma.user.findUnique({ where });
    }

    async createUser(data: Prisma.UserCreateInput) {
        const email = data.email;
        const userExists = await this.prisma.user.findUnique({ where: { email } });

        if (userExists) {
            throw new ConflictException({ message: 'Email is already in use' });
        }

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(data.password, salt);

        return this.prisma.user.create({data: { ...data, password: hash }});
    }
}
