import { ApiProperty, PartialType } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseEntity } from 'src/interfaces';

export class OrderDetailsEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  count: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  sum: string;

  @ApiProperty()
  orderId: number;
}

export class OrderEntity extends BaseEntity {
  @ApiProperty()
  color: string;

  @ApiProperty()
  customer: string;

  @ApiProperty()
  photoSet: string;

  @ApiProperty()
  deadline: Array<string>;

  @ApiProperty({ required: false })
  comment?: string;

  @ApiProperty({
    enum: [
      $Enums.OrderStatusVariant.Done,
      $Enums.OrderStatusVariant.InProgress,
      $Enums.OrderStatusVariant.Ready,
    ],
  })
  status: $Enums.OrderStatusVariant;

  @ApiProperty({ type: [OrderDetailsEntity] })
  details: Array<OrderDetailsEntity>;

  @ApiProperty()
  orderListId: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customer: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  photoSet: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  deadline: Array<string>;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({
    enum: [
      $Enums.OrderStatusVariant.Done,
      $Enums.OrderStatusVariant.InProgress,
      $Enums.OrderStatusVariant.Ready,
    ],
  })
  @IsIn([
    $Enums.OrderStatusVariant.Done,
    $Enums.OrderStatusVariant.InProgress,
    $Enums.OrderStatusVariant.Ready,
  ])
  status: $Enums.OrderStatusVariant;

  @ApiProperty({ type: [OrderDetailsEntity] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderDetailsEntity)
  details: Array<OrderDetailsEntity>;
}

export class UpdateOrderDto extends PartialType(OrderEntity) {}

export class OrderListEntity extends BaseEntity {
  @ApiProperty({ type: [OrderEntity] })
  items?: Array<OrderEntity>;

  @ApiProperty()
  ownerId: number;
}
