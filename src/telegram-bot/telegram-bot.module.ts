import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramBotCommand } from './telegram-bot.command';
import { FileSystemsService } from './file-system.service';
import { UserService } from 'src/user/user.service';
import { DataBaseService } from 'src/data-base/data-base.service';
import { PasswordService } from 'src/user/password.service';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get('TELEGRAM_TOKEN'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    TelegramBotService,
    TelegramBotCommand,
    FileSystemsService,
    UserService,
    DataBaseService,
    PasswordService,
  ],
})
export class TelegramBotModule {}
