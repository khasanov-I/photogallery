import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Picture } from './pictures.model';
import { InjectModel } from '@nestjs/sequelize';
import * as uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import sharp from 'sharp';
import { CreatePictureDto } from './dto/create-picture-dto';
import { Sequelize } from 'sequelize-typescript';

export interface MulterFile {
  fieldname: string; // Имя поля формы
  originalname: string; // Оригинальное имя файла
  encoding: string; // Кодировка файла
  mimetype: string; // MIME-тип (например, 'image/jpeg')
  size: number; // Размер файла в байтах
  buffer: Buffer; // Содержимое файла в виде Buffer
  destination: string; // Путь сохранения (если используется diskStorage)
  filename: string; // Имя файла (если используется diskStorage)
  path: string; // Полный путь (если используется diskStorage)
}

@Injectable()
export class PicturesService {
  constructor(
    @InjectModel(Picture) private pictureRepository: typeof Picture,
    private sequelize: Sequelize,
  ) {}

  async serveFile(file: MulterFile): Promise<{
    originalFile: string;
    convertedFile: string;
  }> {
    let originalFilePath: string;
    let webpFilePath: string;
    try {
      const fileExtension = file.originalname.split('.').pop();
      const name = uuid.v4();
      const fileName = name + '.' + fileExtension;
      const filePath = path.resolve(__dirname, '..', '..', 'static');

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      const webpFileName = `${name}.webp`;
      webpFilePath = path.resolve(filePath, webpFileName);
      await sharp(file.buffer).webp({ quality: 80 }).toFile(webpFilePath);
      originalFilePath = path.resolve(filePath, fileName);

      fs.writeFileSync(originalFilePath, file.buffer);

      return { originalFile: fileName, convertedFile: webpFilePath };
    } catch (e) {
      if (webpFilePath && fs.existsSync(webpFilePath)) {
        fs.unlinkSync(webpFilePath);
      }
      if (originalFilePath && fs.existsSync(originalFilePath)) {
        fs.unlinkSync(originalFilePath);
      }
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createPicture(dto: CreatePictureDto) {
    const files = await this.serveFile(dto.file);
    await this.pictureRepository.create({
      name: dto.name.toLowerCase(),
      originalPath: files.originalFile,
      webpPath: files.convertedFile,
      userId: dto.userId,
    });
  }

  async getAll(offset: number, search: string) {
    return await this.pictureRepository.findAndCountAll({
      limit: 10,
      offset,
      order: [['createdAt', 'DESC']],
      where: {
        name: search.toLowerCase(),
      },
    });
  }

  async changePictureName(id: number, name: string) {
    const candidate = await this.pictureRepository.findByPk(id);
    if (!candidate) {
      throw new HttpException('Фотография не найдена', HttpStatus.NOT_FOUND);
    }
    await this.pictureRepository.update(
      { name },
      { where: { id: candidate.id } },
    );
  }

  async deletePic(id: number) {
    const candidate = await this.pictureRepository.findByPk(id);
    if (!candidate) {
      throw new HttpException('Фотография не найдена', HttpStatus.NOT_FOUND);
    }
    const transaction = await this.sequelize.transaction();
    try {
      await this.pictureRepository.destroy({
        where: { id: candidate.id },
        transaction,
      });
      fs.unlinkSync(candidate.originalPath);
      fs.unlinkSync(candidate.webpPath);
      await transaction.commit();
    } catch (err) {
      transaction.rollback();
      throw new HttpException(
        'Ошибка при удалении фотографии',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
