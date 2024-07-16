import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DataBaseModule } from 'src/data-base/data-base.module';
import { PasswordService } from './password.service';

@Module({
  imports: [DataBaseModule],
  controllers: [UserController],
  providers: [UserService, PasswordService],
})
export class UserModule {}
