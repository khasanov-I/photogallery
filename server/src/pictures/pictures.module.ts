import { Module } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { PicturesController } from './pictures.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Picture } from './pictures.model';

@Module({
  providers: [PicturesService],
  controllers: [PicturesController],
  imports: [SequelizeModule.forFeature([Picture])],
})
export class PicturesModule {}
