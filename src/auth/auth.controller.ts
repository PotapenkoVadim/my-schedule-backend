import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ENDPOINT_DESCRIPTIONS } from './constants';
import { Session, SignInDto, TokenResponse } from './interfaces';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CreateUserDto, UserEntity } from 'src/user/interfaces';
import { SessionDecorator } from './session.decorator';
import { RoleGuard, Roles } from './role.guard';
import { $Enums } from '@prisma/client';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @Roles([$Enums.RoleVariant.Admin])
  @UseGuards(AuthGuard, RoleGuard)
  @ApiCreatedResponse({ type: TokenResponse })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.signUp })
  async signUp(@Body() userDto: CreateUserDto): Promise<TokenResponse> {
    return this.authService.signUp(userDto);
  }

  @Post('sign-in')
  @ApiOkResponse({ type: TokenResponse })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.signIn })
  async signIn(@Body() singInDto: SignInDto): Promise<TokenResponse> {
    return this.authService.signIn(singInDto);
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
