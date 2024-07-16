import { BadRequestException, Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/data-base/data-base.service';
import { UpdateUserSettingsDto, UserSettingsEntity } from './interfaces';

@Injectable()
export class UserSettingsService {
  constructor(private readonly dataBaseService: DataBaseService) {}

  async getUserSettingsById(id: number): Promise<UserSettingsEntity | null> {
    return this.dataBaseService.userSettings.findUnique({ where: { id } });
  }

  async updateUserSettings(
    id: number,
    userSettingsDto: UpdateUserSettingsDto,
  ): Promise<UserSettingsEntity> {
    const userSettings = await this.getUserSettingsById(id);

    if (!userSettings) {
      throw new BadRequestException();
    }

    return this.dataBaseService.userSettings.update({
      where: { id },
      data: userSettingsDto,
    });
  }
}
