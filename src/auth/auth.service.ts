import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async signUp(data: {
        name: string,
        email: string,
        password: string
    }) {
        const email = data.email;

        if (await this.userService.user({ email })) {
            throw new ConflictException('Email is already in use');
        }

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(data.password, salt);

        const user = await this.userService.createUser({...data, password: hash});

        return {
            id: user.id,
            email: user.email
        }
    }

    async signIn(data: {
        email: string,
        password: string
    }) {
        const user = await this.userService.user({ email: data.email });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!await bcrypt.compare(data.password, user.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            type: 'access',
        }, {
            expiresIn: '15m'
        })

        const refreshToken = await this.jwtService.signAsync({
            sub: user.id,
            type: 'refresh',
        }, {
            expiresIn: '7d'
        })

        return {
            accessToken,
            refreshToken,
        }
    }

    async refresh(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {secret: process.env.JWT_SECRET});

            if (payload?.type !== 'refresh') {
                throw new UnauthorizedException();
            }

            const accessToken = await this.jwtService.signAsync({
                sub: payload.sub,
                type: 'access',
            }, {
                expiresIn: '15m'
            })

            return {
                accessToken,
            }

        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
