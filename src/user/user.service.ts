import { BadRequestException, Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/data-base/data-base.service';
import { CreateUserDto, UpdateUserDto, UserEntity } from './interfaces';
import { PasswordService } from './password.service';
import { SignInDto } from 'src/auth/interfaces';
import { generateRandomString } from 'src/utils';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UserService {
  constructor(
    private readonly dataBaseService: DataBaseService,
    private readonly passwordService: PasswordService,
  ) {}

  async createUser({
    password,
    role,
    username,
  }: CreateUserDto): Promise<UserEntity> {
    const currentYear = new Date().getFullYear();
    const user = await this.getUserByUsername(username, currentYear);

    if (user) {
      throw new BadRequestException({ type: 'user-exists' });
    }

    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(password, salt);

    return this.dataBaseService.user.create({
      data: {
        hash,
        salt,
        role,
        username,
        settings: { create: { theme: 'Light' } },
        orders: { create: { items: {} } },
      },
    });
  }

  async getUsers(): Promise<Array<UserEntity>> {
    return this.dataBaseService.user.findMany();
  }

  async getUserById(
    id: number,
    currentYear: number,
  ): Promise<UserEntity | null> {
    return this.dataBaseService.user.findUnique({
      where: { id },
      include: {
        settings: true,
        orders: {
          include: {
            items: {
              include: { details: true },
              where: { expiredYears: { hasSome: [currentYear] } },
            },
          },
        },
      },
    });
  }

  async getUserByUsername(
    username: string,
    currentYear: number,
  ): Promise<UserEntity | null> {
    return this.dataBaseService.user.findUnique({
      where: { username },
      include: {
        settings: true,
        orders: {
          include: {
            items: {
              include: { details: true },
              where: { expiredYears: { hasSome: [currentYear] } },
            },
          },
        },
      },
    });
  }

  async updateUser(
    id: number,
    { role, username }: UpdateUserDto,
  ): Promise<UserEntity> {
    const currentYear = new Date().getFullYear();
    const duplicateUser = await this.getUserByUsername(username, currentYear);
    const user = await this.getUserById(id, currentYear);

    if (duplicateUser || !user) {
      throw new BadRequestException();
    }

    return this.dataBaseService.user.update({
      where: { id },
      data: { role, username },
    });
  }

  async deleteUser(id: number): Promise<UserEntity> {
    return this.dataBaseService.user.delete({ where: { id } });
  }

  async findAndValidatePassword(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    const currentYear = new Date().getFullYear();
    const user = await this.getUserByUsername(username, currentYear);

    if (!user) {
      return null;
    }

    const hash = this.passwordService.getHash(password, user.salt);

    if (hash !== user.hash) {
      return null;
    }

    return user;
  }

  async generateGuest(): Promise<SignInDto> {
    const username = generateRandomString();
    const password = generateRandomString();

    await this.createUser({ username, password, role: 'Guest' });

    return { username, password };
  }

  @Cron('0 0 * * *')
  async deleteGeneratedGuest(): Promise<void> {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    await this.dataBaseService.user.deleteMany({
      where: {
        createdAt: { lte: date },
        role: 'Guest',
      },
    });
  }
}
