import { BadRequestException, Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/data-base/data-base.service';
import { CreateOrderDto, OrderListEntity, UpdateOrderDto } from './interfaces';

@Injectable()
export class OrderListService {
  constructor(private readonly dataBaseService: DataBaseService) {}

  async getOrderLists(): Promise<Array<OrderListEntity>> {
    return this.dataBaseService.orderList.findMany({
      include: { items: { include: { details: true } } },
    });
  }

  async getOrderListById(id: number): Promise<OrderListEntity> {
    return this.dataBaseService.orderList.findUnique({
      where: { id },
      include: { items: { include: { details: true } } },
    });
  }

  async getOrderListByUserId(ownerId: number): Promise<OrderListEntity> {
    return this.dataBaseService.orderList.findUnique({ where: { ownerId } });
  }

  async addOrderListItem(
    ownerId: number,
    { details, ...orderData }: CreateOrderDto,
  ): Promise<OrderListEntity> {
    return this.dataBaseService.orderList.update({
      where: { ownerId },
      data: {
        items: {
          create: {
            ...orderData,
            details: { create: details },
          },
        },
      },
      include: { items: { include: { details: true } } },
    });
  }

  async updateOrderListItem(
    ownerId: number,
    itemId: number,
    { details, ...orderData }: UpdateOrderDto,
  ): Promise<OrderListEntity> {
    const order = await this.dataBaseService.order.findUnique({
      where: { id: itemId },
    });

    if (!order) {
      throw new BadRequestException();
    }

    return this.dataBaseService.orderList.update({
      where: { ownerId },
      data: {
        items: {
          update: {
            where: { id: itemId },
            data: {
              ...orderData,
              details: {
                deleteMany: {},
                create: details,
              },
            },
          },
        },
      },
      include: { items: { include: { details: true } } },
    });
  }

  async deleteOrderListItem(
    ownerId: number,
    itemId: number,
  ): Promise<OrderListEntity> {
    const order = await this.dataBaseService.order.findUnique({
      where: { id: itemId },
    });

    if (!order) {
      throw new BadRequestException();
    }

    return this.dataBaseService.orderList.update({
      where: { ownerId },
      data: {
        items: {
          delete: { id: itemId },
        },
      },
      include: { items: { include: { details: true } } },
    });
  }
}
