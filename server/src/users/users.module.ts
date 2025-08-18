import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { HashService } from 'src/hash/hash.service';

@Module({
  providers: [UsersService, HashService],
  controllers: [UsersController],
  imports: [SequelizeModule.forFeature([User])],
})
export class UsersModule {}
