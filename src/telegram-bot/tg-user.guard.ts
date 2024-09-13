import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramContext } from './interfaces';
import { FORBIDDEN_TEXT } from './constants';

@Injectable()
export class TgUserGuard implements CanActivate {
  constructor(private readonly telegramBotService: TelegramBotService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const telegramCtx = context.getArgs()[0] as TelegramContext;
    const userId = telegramCtx.from.id;
    const allowUsers = [
      this.telegramBotService.adminId,
      this.telegramBotService.userId,
    ];

    if (!allowUsers.includes(String(userId))) {
      await telegramCtx.reply(FORBIDDEN_TEXT);

      return false;
    }

    return true;
  }
}
