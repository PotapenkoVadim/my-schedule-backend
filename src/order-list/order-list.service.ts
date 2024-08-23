import { BadRequestException, Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/data-base/data-base.service';
import { CreateOrderDto, OrderListEntity, UpdateOrderDto } from './interfaces';
import { getExpiredYears } from '../utils';

@Injectable()
export class OrderListService {
  constructor(private readonly dataBaseService: DataBaseService) {}

  async getOrderLists(currentYear: number): Promise<Array<OrderListEntity>> {
    return this.dataBaseService.orderList.findMany({
      include: {
        items: {
          include: { details: true },
          where: { expiredYears: { hasSome: [currentYear] } },
        },
      },
    });
  }

  async getOrderListById(
    id: number,
    currentYear: number,
  ): Promise<OrderListEntity> {
    return this.dataBaseService.orderList.findUnique({
      where: { id },
      include: {
        items: {
          include: { details: true },
          where: { expiredYears: { hasSome: [currentYear] } },
        },
      },
    });
  }

  async getOrderListByUserId(ownerId: number): Promise<OrderListEntity> {
    return this.dataBaseService.orderList.findUnique({ where: { ownerId } });
  }

  async addOrderListItem(
    ownerId: number,
    { details, currentYear, ...orderData }: CreateOrderDto,
  ): Promise<OrderListEntity> {
    return this.dataBaseService.orderList.update({
      where: { ownerId },
      data: {
        items: {
          create: {
            ...orderData,
            expiredYears: getExpiredYears(orderData.deadline),
            details: { create: details },
          },
        },
      },
      include: {
        items: {
          include: { details: true },
          where: { expiredYears: { hasSome: [currentYear] } },
        },
      },
    });
  }

  async updateOrderListItem(
    ownerId: number,
    itemId: number,
    { details, currentYear, ...orderData }: UpdateOrderDto,
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
              expiredYears: getExpiredYears(orderData.deadline),
              details: {
                deleteMany: {},
                createMany: {
                  data: details.map((item) => ({
                    count: item.count,
                    description: item.description,
                    sum: item.sum,
                  })),
                },
              },
            },
          },
        },
      },
      include: {
        items: {
          include: { details: true },
          where: { expiredYears: { hasSome: [currentYear] } },
        },
      },
    });
  }

  async deleteOrderListItem(
    ownerId: number,
    itemId: number,
    currentYear: number,
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
      include: {
        items: {
          include: { details: true },
          where: { expiredYears: { hasSome: [currentYear] } },
        },
      },
    });
  }
}
