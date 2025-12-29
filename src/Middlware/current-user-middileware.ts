import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {

    constructor(private jwtService: JwtService) { }

    use(req: Request, res: Response, next: NextFunction) {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('No token provided in middleware');
        }
        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid token format');
        }

        try {
            const payload = this.jwtService.verify(token);
            req['user'] = payload;
        } catch (error) {
            throw new ForbiddenException('Invalid or expired token');
        }

        next();
    }
}