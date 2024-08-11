import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './interfaces';
import { UserService } from 'src/user/user.service';
import { CreateUserDto, UserEntity } from 'src/user/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(
    userDto: CreateUserDto,
  ): Promise<{ user: UserEntity; token: string }> {
    const user = await this.userService.createUser(userDto);

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
      username: user.username,
    });

    return { user, token: accessToken };
  }

  async signIn({
    username,
    password,
  }: SignInDto): Promise<{ user: UserEntity; token: string }> {
    const user = await this.userService.findAndValidatePassword(
      username,
      password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
      username: user.username,
    });

    return { token: accessToken, user };
  }

  async session(userId: number, currentYear: number): Promise<UserEntity> {
    return this.userService.getUserById(userId, currentYear);
  }
}
