import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateOrderDto, OrderListEntity, UpdateOrderDto } from './interfaces';
import { OrderListService } from './order-list.service';
import { ENDPOINT_DESCRIPTIONS } from './constants';
import { Session } from 'src/auth/interfaces';
import { SessionDecorator } from 'src/auth/session.decorator';
import { RoleGuard, Roles } from 'src/auth/role.guard';
import { $Enums } from '@prisma/client';

@ApiTags('Order List')
@Controller('order-list')
@UseGuards(AuthGuard, RoleGuard)
export class OrderListController {
  constructor(private readonly orderListService: OrderListService) {}

  @Get()
  @Roles([$Enums.RoleVariant.User, $Enums.RoleVariant.Guest])
  @ApiOkResponse({ type: [OrderListEntity] })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.getOrderLists })
  async getOrderLists(
    @Query('currentYear', ParseIntPipe) currentYear: number,
  ): Promise<Array<OrderListEntity>> {
    return this.orderListService.getOrderLists(currentYear);
  }

  @Get(':id')
  @Roles([$Enums.RoleVariant.User, $Enums.RoleVariant.Guest])
  @ApiOkResponse({ type: OrderListEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.getOrderListById })
  async getOrderListById(
    @Param('id', ParseIntPipe) id: number,
    @Query('currentYear', ParseIntPipe) currentYear: number,
  ): Promise<OrderListEntity> {
    return this.orderListService.getOrderListById(id, currentYear);
  }

  @Post('item')
  @Roles([$Enums.RoleVariant.User, $Enums.RoleVariant.Guest])
  @ApiCreatedResponse({ type: OrderListEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.addOrderListItem })
  async addOrderListItem(
    @Body() orderDto: CreateOrderDto,
    @SessionDecorator() session: Session,
  ): Promise<OrderListEntity> {
    return this.orderListService.addOrderListItem(session.id, orderDto);
  }

  @Patch('item/:id')
  @Roles([$Enums.RoleVariant.User, $Enums.RoleVariant.Guest])
  @ApiOkResponse({ type: OrderListEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.updateOrderListItem })
  async updateOrderListItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() orderDto: UpdateOrderDto,
    @SessionDecorator() session: Session,
  ): Promise<OrderListEntity> {
    return this.orderListService.updateOrderListItem(session.id, id, orderDto);
  }

  @Delete('item/:id')
  @Roles([$Enums.RoleVariant.User, $Enums.RoleVariant.Guest])
  @ApiOkResponse({ type: OrderListEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.deleteOrderListItem })
  async deleteOrderListItem(
    @Param('id', ParseIntPipe) id: number,
    @SessionDecorator() session: Session,
    @Query('currentYear', ParseIntPipe) currentYear: number,
  ): Promise<OrderListEntity> {
    return this.orderListService.deleteOrderListItem(
      session.id,
      id,
      currentYear,
    );
  }
}
