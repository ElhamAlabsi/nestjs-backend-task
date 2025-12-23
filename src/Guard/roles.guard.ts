import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

export class RolesGuard implements CanActivate {
    constructor(private requiredRole: string) { }

    canActivate(context: ExecutionContext): boolean {
        const user = context.switchToHttp().getRequest().user;

        if (!user) {
            throw new ForbiddenException('Access denied');
        }
        return true;
    }
}