import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'src/interfaces';
import { OrderListEntity } from 'src/order-list/interfaces';
import { UserSettingsEntity } from 'src/user-settings/interfaces';

export class UserEntity extends BaseEntity {
  @ApiProperty()
  username: string;

  @Exclude({ toPlainOnly: true })
  hash: string;

  @Exclude({ toPlainOnly: true })
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

  @ApiProperty()
  telegram?: string;
}

export class UserDto {
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

  @ApiProperty()
  @IsString()
  telegram?: string;
}
