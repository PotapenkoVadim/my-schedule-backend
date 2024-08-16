import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ENDPOINT_DESCRIPTIONS } from './constants';
import { Session, SignInDto } from './interfaces';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { CreateUserDto, UserEntity } from 'src/user/interfaces';
import { SessionDecorator } from './session.decorator';
import { RoleGuard, Roles } from './role.guard';
import { $Enums } from '@prisma/client';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('sign-up')
  @Roles([$Enums.RoleVariant.Admin])
  @UseGuards(AuthGuard, RoleGuard)
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
  @ApiOkResponse({ type: UserEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.signIn })
  async signIn(
    @Body() singInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserEntity> {
    const { token, user } = await this.authService.signIn(singInDto);
    this.cookieService.setToken(response, token);

    return user;
  }

  @Get('sign-out')
  @Roles([
    $Enums.RoleVariant.User,
    $Enums.RoleVariant.Admin,
    $Enums.RoleVariant.Guest,
  ])
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOkResponse()
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.signOut })
  async signOut(@Res({ passthrough: true }) response: Response) {
    this.cookieService.removeToken(response);

    return { status: HttpStatus.OK };
  }

  @Get('session')
  @Roles([
    $Enums.RoleVariant.User,
    $Enums.RoleVariant.Admin,
    $Enums.RoleVariant.Guest,
  ])
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOkResponse({ type: UserEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.session })
  async session(
    @SessionDecorator() session: Session,
    @Query('currentYear', ParseIntPipe) currentYear: number,
  ): Promise<UserEntity> {
    return this.authService.session(session.id, currentYear);
  }
}
