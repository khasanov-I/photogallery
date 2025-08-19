import { MulterFile } from '../pictures.service';

export class CreatePictureDto {
  file: MulterFile;
  name: string;
  userId: number;
}
