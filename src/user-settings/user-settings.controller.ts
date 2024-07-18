import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserSettingsService } from './user-settings.service';
import { UpdateUserSettingsDto, UserSettingsEntity } from './interfaces';
import { ENDPOINT_DESCRIPTIONS } from './constants';

@ApiTags('User Settings')
@Controller('user-settings')
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
