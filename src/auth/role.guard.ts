import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserEntity } from 'src/user/interfaces';
import { $Enums } from '@prisma/client';

export const Roles = Reflector.createDecorator<Array<$Enums.RoleVariant>>();

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: Array<$Enums.RoleVariant>, userRole?: string) {
    return roles.some((role) => role === userRole);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles = this.reflector.get<Array<$Enums.RoleVariant>>(
      Roles,
      context.getHandler(),
    );

    if (!allowedRoles) return true;

    const request = context.switchToHttp().getRequest();
    const sessionInfo = request.session as UserEntity;

    const isAllowed = this.matchRoles(allowedRoles, sessionInfo?.role);

    if (!isAllowed) {
      throw new ForbiddenException();
    }

    return true;
  }
}
