import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role';
@Injectable()
export class RolesGuard implements CanActivate {


    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0)
            return Promise.resolve(true);

        const user = context.switchToHttp().getRequest().user;
        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
            throw new ForbiddenException('User does not have the required role');
        }

        if (!this.matchRoles(requiredRoles, user.role))
            throw new ForbiddenException('User does not have the required role');

        return Promise.resolve(true);

    }

    private matchRoles(requiredRoles: Role[], userRole: Role): Promise<boolean> {
        return Promise.resolve(requiredRoles.includes(userRole));
    }

}


