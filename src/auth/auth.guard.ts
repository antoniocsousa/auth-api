import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "./dacorators/public.decorator.js";
import "dotenv/config";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;

        if (!authorization) throw new UnauthorizedException();

        const [type, token] = authorization.split(' ');


        if (type !== 'Bearer' || !token) throw new UnauthorizedException();

        try {
            const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET});

            if (payload.type !== 'access') {
                throw new UnauthorizedException();
            }

            request.user = payload;

            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }
}