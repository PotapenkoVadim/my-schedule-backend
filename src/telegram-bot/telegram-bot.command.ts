import { Ctx, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { TelegramContext } from './interfaces';
import { TelegramBotService } from './telegram-bot.service';
import { Cron } from '@nestjs/schedule';
import { Telegraf } from 'telegraf';
import { BACKUP_PROVIDE_TEXT } from './constants';
import { UseGuards } from '@nestjs/common';
import { TgUserGuard } from './tg-user.guard';

@Update()
@UseGuards(TgUserGuard)
export class TelegramBotCommand {
  constructor(
    private readonly telegramBotService: TelegramBotService,
    @InjectBot() private readonly telegramBot: Telegraf<TelegramContext>,
  ) {}

  @Start()
  async startCommand(@Ctx() ctx: TelegramContext) {
    const greetingMessage = this.telegramBotService.getUserGreetings(ctx);

    await ctx.reply(greetingMessage);
  }

  @Cron('0 0 * * *')
  async sendBackupFileToAdmin() {
    const adminId = this.telegramBotService.adminId;
    const backupFile = this.telegramBotService.getDatabaseBackupFile();
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `${currentDate}-backup.sql`;

    await this.telegramBot.telegram.sendMessage(adminId, BACKUP_PROVIDE_TEXT);
    await this.telegramBot.telegram.sendDocument(adminId, {
      source: backupFile,
      filename,
    });
  }

  @On('text')
  async handleMessage(
    @Message('text') message: string,
    @Ctx() ctx: TelegramContext,
  ) {
    await ctx.reply('Скоро! Мы работаем над этим!');
    await ctx.reply(`Ваш текст: '${message}'`);
  }
}
