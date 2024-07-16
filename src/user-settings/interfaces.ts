import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsIn } from 'class-validator';

export class UserSettingsEntity {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: [$Enums.ThemeVariant.Dark, $Enums.ThemeVariant.Light] })
  theme: $Enums.ThemeVariant;

  @ApiProperty()
  ownerId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UpdateUserSettingsDto {
  @ApiProperty({ enum: [$Enums.ThemeVariant.Dark, $Enums.ThemeVariant.Light] })
  @IsIn([$Enums.ThemeVariant.Dark, $Enums.ThemeVariant.Light])
  theme: $Enums.ThemeVariant;
}
