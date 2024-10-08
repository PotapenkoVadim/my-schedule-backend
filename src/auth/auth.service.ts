import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, TokenResponse } from './interfaces';
import { UserService } from 'src/user/user.service';
import { UserDto, UserEntity } from 'src/user/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(userDto: UserDto): Promise<TokenResponse> {
    const user = await this.userService.createUser(userDto);

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
      username: user.username,
    });

    return { token: accessToken };
  }

  async signIn({ username, password }: SignInDto): Promise<TokenResponse> {
    const user = await this.userService.findAndValidatePassword(
      username,
      password,
    );

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
      username: user.username,
    });

    return { token: accessToken };
  }

  async session(userId: number, currentYear: number): Promise<UserEntity> {
    return this.userService.getUserById(userId, currentYear);
  }
}
