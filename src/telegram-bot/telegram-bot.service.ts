import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramContext } from './interfaces';
import { BOT_GREETING } from './constants';
import { FileSystemsService } from './file-system.service';

@Injectable()
export class TelegramBotService {
  public adminId: string;
  public userId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly fileSystemService: FileSystemsService,
  ) {
    this.adminId = this.configService.get('ADMIN_ID');
    this.userId = this.configService.get('WORKER_USER_ID');
  }

  isAdmin(ctx: TelegramContext) {
    return String(ctx.from.id) === this.adminId;
  }

  isWorkerUser(ctx: TelegramContext) {
    return String(ctx.from.id) === this.userId;
  }

  getUserGreetings(ctx: TelegramContext) {
    const isAdmin = this.isAdmin(ctx);

    return isAdmin ? BOT_GREETING.admin : BOT_GREETING.user;
  }

  getDatabaseBackupFile() {
    const filePath = this.configService.get('DATABASE_BACKUP_PATH');

    return this.fileSystemService.getStreamableFile(filePath);
  }
}
