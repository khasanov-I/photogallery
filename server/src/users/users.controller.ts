import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthDto, CreateUserDto, UpdateUserDto } from './dto/create-user-dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  async register(@Body() dto: CreateUserDto) {
    return await this.usersService.register(dto);
  }

  @Post('/auth')
  async login(@Body() dto: AuthDto) {
    return await this.usersService.auth(dto);
  }

  @Patch('/update_user')
  async changeUserData(@Body() dto: UpdateUserDto) {
    await this.usersService.changeUserData(dto);
  }

  @Get()
  async getAll(@Query() query: { name: string }) {
    return await this.usersService.getAllUsersWithFilter(query.name);
  }
}
