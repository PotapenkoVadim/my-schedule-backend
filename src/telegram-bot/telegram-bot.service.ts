import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramContext } from './interfaces';
import { BOT_GREETING, UNKNOWN_ERROR_TEXT } from './constants';
import { FileSystemsService } from './file-system.service';
import { $Enums } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { isAdmin, isUser } from 'src/utils';

@Injectable()
export class TelegramBotService {
  public mainAdminId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly fileSystemService: FileSystemsService,
    private readonly userService: UserService,
  ) {
    this.mainAdminId = this.configService.get('ADMIN_ID');
  }

  async isAdmin(ctx: TelegramContext) {
    const roles = await this.getTelegramUserRoles(ctx);

    return roles.some(isAdmin);
  }

  async isWorkerUser(ctx: TelegramContext) {
    const roles = await this.getTelegramUserRoles(ctx);

    return roles.some(isUser);
  }

  getUserGreetings(ctx: TelegramContext) {
    const isAdmin = this.isAdmin(ctx);

    return isAdmin ? BOT_GREETING.admin : BOT_GREETING.user;
  }

  getDatabaseBackupFile() {
    const filePath = this.configService.get('DATABASE_BACKUP_PATH');
    const backupFile = this.fileSystemService.getStreamableFile(filePath);

    if (!backupFile) {
      return null;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `${currentDate}-backup.sql`;

    return { source: backupFile, filename };
  }

  async getUserList() {
    try {
      const users = await this.userService.getUsers();
      const userString = users
        .map(
          (user) =>
            `🙎 <b>[${user.id}]\t${user.username}</b>\t - <i>${user.role}</i>`,
        )
        .join('\n');

      return `💬 <b>Текущий список активных пользователей:</b>\n\n${userString}`;
    } catch (e) {
      return UNKNOWN_ERROR_TEXT;
    }
  }

  async deleteUser(id: string) {
    try {
      const deletedUser = await this.userService.deleteUser(Number(id));

      return `💀 Пользователь ${deletedUser.username} успешно удален!`;
    } catch (e) {
      return UNKNOWN_ERROR_TEXT;
    }
  }

  async getTelegramUserRoles(ctx: TelegramContext): Promise<Array<$Enums.RoleVariant>> {
    const users = await this.userService.getUsersByTelegram(ctx.from.username);

    return users.map(item => item.role);
  }
}
