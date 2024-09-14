import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramContext } from './interfaces';
import { BOT_GREETING, UNKNOWN_ERROR_TEXT } from './constants';
import { FileSystemsService } from './file-system.service';
import { $Enums } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TelegramBotService {
  public adminId: string;
  public userId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly fileSystemService: FileSystemsService,
    private readonly userService: UserService,
  ) {
    this.adminId = this.configService.get('ADMIN_ID');
    this.userId = this.configService.get('WORKER_USER_ID');
  }

  getUserRole(id: number) {
    switch (true) {
      case this.isAdmin(id):
        return $Enums.RoleVariant.Admin;

      case this.isWorkerUser(id):
        return $Enums.RoleVariant.User;

      default:
        return $Enums.RoleVariant.Guest;
    }
  }

  isAdmin(id: number) {
    return String(id) === this.adminId;
  }

  isWorkerUser(id: number) {
    return String(id) === this.userId;
  }

  getUserGreetings(ctx: TelegramContext) {
    const isAdmin = this.isAdmin(ctx.from.id);

    return isAdmin ? BOT_GREETING.admin : BOT_GREETING.user;
  }

  getDatabaseBackupFile() {
    const filePath = this.configService.get('DATABASE_BACKUP_PATH');
    const backupFile = this.fileSystemService.getStreamableFile(filePath);
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
}
