import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ENDPOINT_DESCRIPTIONS } from './constants';
import { SignInDto } from './interfaces';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { CreateUserDto, UserEntity } from 'src/user/interfaces';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('sign-up')
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.signUp })
  async signUp(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserEntity> {
    const { user, token } = await this.authService.signUp(userDto);
    this.cookieService.setToken(response, token);

    return user;
  }

  @Post('sign-in')
  @ApiOkResponse()
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.signIn })
  async signIn(
    @Body() singInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.signIn(singInDto);
    this.cookieService.setToken(response, token);
  }

  @Get('sign-out')
  @UseGuards(AuthGuard)
  @ApiOkResponse()
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.signOut })
  async signOut(@Res({ passthrough: true }) response: Response) {
    this.cookieService.removeToken(response);
  }
}
