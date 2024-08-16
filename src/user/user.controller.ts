import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserEntity } from './interfaces';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { ENDPOINT_DESCRIPTIONS } from './constants';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard, Roles } from 'src/auth/role.guard';
import { $Enums } from '@prisma/client';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard, RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles([$Enums.RoleVariant.Admin])
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.createUser })
  async createUser(@Body() userDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(userDto);
  }

  @Get()
  @Roles([$Enums.RoleVariant.Admin])
  @ApiCreatedResponse({ type: [UserEntity] })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.getUsers })
  async getUsers(): Promise<Array<UserEntity>> {
    return this.userService.getUsers();
  }

  @Get(':id')
  @Roles([
    $Enums.RoleVariant.User,
    $Enums.RoleVariant.Admin,
    $Enums.RoleVariant.Guest,
  ])
  @ApiOkResponse({ type: UserEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.getUserById })
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @Query('currentYear', ParseIntPipe) currentYear: number,
  ): Promise<UserEntity | null> {
    return this.userService.getUserById(id, currentYear);
  }

  @Patch(':id')
  @Roles([
    $Enums.RoleVariant.User,
    $Enums.RoleVariant.Admin,
    $Enums.RoleVariant.Guest,
  ])
  @ApiOkResponse({ type: UserEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.updateUser })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(id, userDto);
  }

  @Delete(':id')
  @Roles([$Enums.RoleVariant.Admin])
  @ApiOkResponse({ type: UserEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.deleteUser })
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.deleteUser(id);
  }
}
