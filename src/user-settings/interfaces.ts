import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsIn } from 'class-validator';
import { BaseEntity } from 'src/interfaces';

export class UserSettingsEntity extends BaseEntity {
  @ApiProperty({ enum: [$Enums.ThemeVariant.Dark, $Enums.ThemeVariant.Light] })
  theme: $Enums.ThemeVariant;

  @ApiProperty()
  ownerId: number;
}

export class UpdateUserSettingsDto {
  @ApiProperty({ enum: [$Enums.ThemeVariant.Dark, $Enums.ThemeVariant.Light] })
  @IsIn([$Enums.ThemeVariant.Dark, $Enums.ThemeVariant.Light])
  theme: $Enums.ThemeVariant;
}
