import { Ctx, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { TelegramContext } from './interfaces';
import { TelegramBotService } from './telegram-bot.service';
import { Cron } from '@nestjs/schedule';
import { Telegraf } from 'telegraf';
import {
  BACKUP_ADMIN_COMMANDS,
  BACKUP_PROVIDE_TEXT,
  DELETE_ADMIN_COMMANDS,
  FORBIDDEN_TEXT,
  LIST_ADMIN_COMMANDS,
  NO_ID_ERROR_TEXT,
  UNKNOWN_ERROR_TEXT,
} from './constants';
import { UseGuards } from '@nestjs/common';
import { TgRoleGuard } from './tg-role.guard';
import { Roles } from 'src/auth/role.guard';
import { $Enums } from '@prisma/client';

@Update()
@UseGuards(TgRoleGuard)
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

  @Cron('0 0 * * 0')
  async sendBackupFileToAdmin() {
    const adminId = this.telegramBotService.mainAdminId;
    const backup = this.telegramBotService.getDatabaseBackupFile();
    if (!backup) {
      return await this.telegramBot.telegram.sendMessage(
        adminId,
        UNKNOWN_ERROR_TEXT,
      );
    }

    await this.telegramBot.telegram.sendDocument(adminId, backup);
    await this.telegramBot.telegram.sendMessage(adminId, BACKUP_PROVIDE_TEXT);
  }

  @Roles([$Enums.RoleVariant.Admin])
  async sendUserList(@Ctx() ctx: TelegramContext) {
    const userList = await this.telegramBotService.getUserList();

    await ctx.reply(userList, { parse_mode: 'HTML' });
  }

  @Roles([$Enums.RoleVariant.Admin])
  async deleteUser(@Ctx() ctx: TelegramContext, id: string) {
    if (!id) return await ctx.reply(NO_ID_ERROR_TEXT);

    const result = await this.telegramBotService.deleteUser(id);
    await ctx.reply(result);
  }

  @On('text')
  @Roles([$Enums.RoleVariant.User, $Enums.RoleVariant.Admin])
  async handleMessage(
    @Message('text') message: string,
    @Ctx() ctx: TelegramContext,
  ) {
    const lowerMessage = message.toLocaleLowerCase();

    switch (true) {
      case BACKUP_ADMIN_COMMANDS.includes(lowerMessage): {
        if (this.telegramBotService.isAdmin(ctx)) {
          this.sendBackupFileToAdmin();
          break;
        }
      }

      case DELETE_ADMIN_COMMANDS.includes(lowerMessage): {
        if (this.telegramBotService.isAdmin(ctx)) {
          const id = lowerMessage.split(' ')[1];
          this.deleteUser(ctx, id);
          break;
        }
      }

      case LIST_ADMIN_COMMANDS.includes(lowerMessage): {
        if (this.telegramBotService.isAdmin(ctx)) {
          this.sendUserList(ctx);
          break;
        }
      }

      default: {
        await ctx.reply(FORBIDDEN_TEXT);
        break;
      }
    }
  }
}
