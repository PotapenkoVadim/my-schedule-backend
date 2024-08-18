import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserSettingsService } from './user-settings.service';
import { UpdateUserSettingsDto, UserSettingsEntity } from './interfaces';
import { ENDPOINT_DESCRIPTIONS } from './constants';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard, Roles } from 'src/auth/role.guard';
import { $Enums } from '@prisma/client';

@ApiTags('User Settings')
@Controller('user-settings')
@UseGuards(AuthGuard, RoleGuard)
@Roles([
  $Enums.RoleVariant.User,
  $Enums.RoleVariant.Admin,
  $Enums.RoleVariant.Guest,
])
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get()
  @ApiOkResponse({ type: [UserSettingsEntity] })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.getUserSettings })
  async getUserSettings(): Promise<Array<UserSettingsEntity>> {
    return this.userSettingsService.getUserSettings();
  }

  @Get(':id')
  @ApiOkResponse({ type: UserSettingsEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.getUserSettingById })
  async getUserSettingById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserSettingsEntity | null> {
    return this.userSettingsService.getUserSettingsById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserSettingsEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.updateUserSettings })
  async updateUserSettings(
    @Param('id', ParseIntPipe) id: number,
    @Body() userSettingsDto: UpdateUserSettingsDto,
  ): Promise<UserSettingsEntity> {
    return this.userSettingsService.updateUserSettings(id, userSettingsDto);
  }
}
