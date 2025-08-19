import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { CreatePictureDto } from './dto/create-picture-dto';

@Controller('pictures')
export class PicturesController {
  constructor(private pictureService: PicturesService) {}

  @Post('/create')
  async register(@Body() dto: CreatePictureDto) {
    await this.pictureService.createPicture(dto);
  }

  @Get('')
  async getAll(@Query() query: { offset: number; search: string }) {
    return await this.pictureService.getAll(query.offset, query.search);
  }

  @Patch('/changeName')
  async changeName(@Body() body: { id: number; name: string }) {
    await this.pictureService.changePictureName(body.id, body.name);
  }

  @Delete('/delete/:id')
  async deletePic(@Param('id') id: number) {
    await this.pictureService.deletePic(id);
  }
}
