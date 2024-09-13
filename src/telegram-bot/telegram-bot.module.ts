import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramBotCommand } from './telegram-bot.command';
import { FileSystemsService } from './file-system.service';

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
  providers: [TelegramBotService, TelegramBotCommand, FileSystemsService],
})
export class TelegramBotModule {}
