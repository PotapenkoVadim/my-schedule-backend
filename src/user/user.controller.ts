import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.createUser })
  async createUser(@Body() userDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(userDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.getUserById })
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserEntity | null> {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.updateUser })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(id, userDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  @ApiOperation({ summary: ENDPOINT_DESCRIPTIONS.deleteUser })
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.deleteUser(id);
  }
}
