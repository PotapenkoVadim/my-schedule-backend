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

  async matchRoles(roles: Array<$Enums.RoleVariant>, context: TelegramContext) {
    const userRoles = await this.telegramBotService.getTelegramUserRoles(context);

    return roles.some((role) => userRoles.includes(role));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRoles = this.reflector.get<Array<$Enums.RoleVariant>>(
      Roles,
      context.getHandler(),
    );

    if (!allowedRoles) return true;

    const telegramCtx = context.getArgs()[0] as TelegramContext;
    const isAllowed = await this.matchRoles(allowedRoles, telegramCtx);

    if (!isAllowed) {
      await telegramCtx.reply(FORBIDDEN_TEXT);

      return false;
    }

    return true;
  }
}
