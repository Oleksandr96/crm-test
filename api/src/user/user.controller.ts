import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { User } from './user.schema';
import { UsersResponseInterface } from './types/users.response.interface';
import { GeoService } from '../geo/geo.service';
import { UserQueryInterface } from './types/user.query.interface';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly geoService: GeoService,
  ) {}

  @Get()
  @HttpCode(200)
  async fetch(
    @Query() query: UserQueryInterface,
  ): Promise<UsersResponseInterface> {
    const usersData = await this.userService.fetch(query);
    usersData.users.map((user: User) => {
      Object.assign(
        user,
        this.geoService.getGeoDataNames(
          user.countryId,
          user.stateId,
          user.cityId,
        ),
      );
    });
    return usersData;
  }

  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') userId: string): Promise<User> {
    return this.userService.getById(userId);
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async create(@Body() userDto: UserDto): Promise<User> {
    return this.userService.create(userDto);
  }

  @Patch(':id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') userId: string,
    @Body('user') userDto: Partial<UserDto>,
  ): Promise<User> {
    return await this.userService.findOneAndUpdate(userId, userDto);
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id') id: string): Promise<User> {
    return this.userService.findByIdAndRemove(id);
  }
}
