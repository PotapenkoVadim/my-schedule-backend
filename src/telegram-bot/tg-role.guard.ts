import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { $Enums } from '@prisma/client';
import { Roles } from 'src/auth/role.guard';
import { TelegramContext } from './interfaces';
import { FORBIDDEN_TEXT } from './constants';
import { TelegramBotService } from './telegram-bot.service';

@Injectable()
export class TgRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  matchRoles(roles: Array<$Enums.RoleVariant>, userId: number) {
    const userRole = this.telegramBotService.getUserRole(userId);

    return roles.some((role) => role === userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRoles = this.reflector.get<Array<$Enums.RoleVariant>>(
      Roles,
      context.getHandler(),
    );

    if (!allowedRoles) return true;

    const telegramCtx = context.getArgs()[0] as TelegramContext;
    const userId = telegramCtx.from.id;

    const isAllowed = this.matchRoles(allowedRoles, userId);

    if (!isAllowed) {
      await telegramCtx.reply(FORBIDDEN_TEXT);

      return false;
    }

    return true;
  }
}
