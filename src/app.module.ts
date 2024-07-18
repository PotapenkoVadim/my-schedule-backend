import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from './data-base/data-base.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { OrderListModule } from './order-list/order-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DataBaseModule,
    UserModule,
    AuthModule,
    UserSettingsModule,
    OrderListModule,
  ],
})
export class AppModule {}
