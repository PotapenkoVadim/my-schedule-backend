import { ApiProperty, PartialType } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseEntity } from 'src/interfaces';

export class OrderDetailsEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  sum: number;

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
  deadline: Array<Date>;

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

  @Exclude({ toPlainOnly: true })
  expiredYears: Array<number>;
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
  deadline: Array<Date>;

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

  @ApiProperty()
  @IsNumber()
  currentYear: number;
}

export class UpdateOrderDto extends PartialType(OrderEntity) {
  @ApiProperty()
  @IsNumber()
  currentYear: number;
}

export class OrderListEntity extends BaseEntity {
  @ApiProperty({ type: [OrderEntity] })
  items?: Array<OrderEntity>;

  @ApiProperty()
  ownerId: number;
}
