import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async user(where: Prisma.UserWhereUniqueInput) {
        return this.prisma.user.findUnique({ where });
    }
}
