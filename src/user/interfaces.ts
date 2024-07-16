import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderListEntity, UserSettingsEntity } from './external-interfaces';

export class UserEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  username: string;

  @ApiProperty()
  hash: string;

  @ApiProperty()
  salt: string;

  @ApiProperty({ type: UserSettingsEntity, required: false })
  settings?: UserSettingsEntity;

  @ApiProperty({ type: OrderListEntity, required: false })
  orders?: OrderListEntity;

  @ApiProperty({
    enum: [
      $Enums.RoleVariant.Admin,
      $Enums.RoleVariant.Guest,
      $Enums.RoleVariant.User,
    ],
  })
  role: $Enums.RoleVariant;
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    enum: [
      $Enums.RoleVariant.Admin,
      $Enums.RoleVariant.Guest,
      $Enums.RoleVariant.User,
    ],
  })
  @IsIn([
    $Enums.RoleVariant.Admin,
    $Enums.RoleVariant.Guest,
    $Enums.RoleVariant.User,
  ])
  role: $Enums.RoleVariant;
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username?: string;

  @ApiProperty({
    required: false,
    enum: [
      $Enums.RoleVariant.Admin,
      $Enums.RoleVariant.Guest,
      $Enums.RoleVariant.User,
    ],
  })
  @IsIn([
    $Enums.RoleVariant.Admin,
    $Enums.RoleVariant.Guest,
    $Enums.RoleVariant.User,
  ])
  @IsOptional()
  role?: $Enums.RoleVariant;
}
