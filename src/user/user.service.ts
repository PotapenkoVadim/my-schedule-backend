import { BadRequestException, Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/data-base/data-base.service';
import { CreateUserDto, UpdateUserDto, UserEntity } from './interfaces';
import { PasswordService } from './password.service';

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
    const user = await this.getUserByUsername(username);

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
        settings: {
          create: { theme: 'Dark' },
        },
        orders: {
          create: { items: {} },
        },
      },
    });
  }

  async getUsers(): Promise<Array<UserEntity>> {
    return this.dataBaseService.user.findMany();
  }

  async getUserById(id: number): Promise<UserEntity | null> {
    return this.dataBaseService.user.findUnique({
      where: { id },
      include: {
        settings: true,
        orders: {
          include: {
            items: {
              include: { details: true },
            },
          },
        },
      },
    });
  }

  async getUserByUsername(username: string): Promise<UserEntity | null> {
    return this.dataBaseService.user.findUnique({
      where: { username },
      include: {
        settings: true,
        orders: {
          include: {
            items: {
              include: { details: true },
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
    const duplicateUser = await this.getUserByUsername(username);
    const user = await this.getUserById(id);

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
    const user = await this.getUserByUsername(username);

    if (!user) {
      return null;
    }

    const hash = this.passwordService.getHash(password, user.salt);

    if (hash !== user.hash) {
      return null;
    }

    return user;
  }
}
