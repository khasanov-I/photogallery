import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';

type PictureCreationAttrs = {
  name: string;
  originalPath: string;
  webpPath: string;
  userId: number;
};

@Table({ tableName: 'pictures' })
export class Picture extends Model<Picture, PictureCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  originalPath: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  webpPath: string;

  @BelongsTo(() => User, { as: 'author' })
  author: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, field: 'user_id' })
  userId: number;
}
