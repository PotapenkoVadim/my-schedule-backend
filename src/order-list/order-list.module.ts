import { Module } from '@nestjs/common';
import { OrderListController } from './order-list.controller';
import { OrderListService } from './order-list.service';
import { DataBaseModule } from 'src/data-base/data-base.module';

@Module({
  imports: [DataBaseModule],
  controllers: [OrderListController],
  providers: [OrderListService],
})
export class OrderListModule {}
