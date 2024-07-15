import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from './data-base/data-base.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DataBaseModule],
})
export class AppModule {}
