import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Picture } from 'src/pictures/pictures.model';

type UserCreationAttrs = {
  mail: string;
  name: string;
  passwordHash: string;
  passwordSalt: string;
};

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
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
  mail: string;

  @Column({ type: DataType.STRING, allowNull: false })
  passwordHash: string;

  @Column({ type: DataType.STRING, allowNull: false })
  passwordSalt: string;

  @HasMany(() => Picture)
  pictures: Picture[];
}
