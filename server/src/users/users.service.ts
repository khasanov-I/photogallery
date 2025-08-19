import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { AuthDto, CreateUserDto, UpdateUserDto } from './dto/create-user-dto';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private hashService: HashService,
  ) {}

  async register(dto: CreateUserDto) {
    const candidate = await this.userRepository.findOne({
      where: { mail: dto.mail },
    });
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким mail уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hash = await this.hashService.hashPassword(dto.password);
    const user = await this.userRepository.create({
      name: dto.name,
      mail: dto.mail,
      passwordHash: hash.hash,
      passwordSalt: hash.salt,
    });
    return user.id;
  }

  async auth(dto: AuthDto) {
    const candidate = await this.userRepository.findOne({
      where: { mail: dto.mail },
    });
    if (!candidate) {
      throw new HttpException(
        'Неверный mail или пароль',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const valid = this.hashService.verifyPassword(
      dto.password,
      candidate.passwordHash,
      candidate.passwordSalt,
    );
    if (!valid) {
      throw new HttpException(
        'Неверный mail или пароль',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return candidate.id;
  }

  async getAllUsersWithFilter(name: string) {
    const users = await this.userRepository.findAll({
      where: { $name$: name },
    });
    return users.map((e) => ({ id: e.id, name: e.name }));
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id);
    return { id: user.id, name: user.name };
  }

  async changeUserData(dto: UpdateUserDto) {
    const candidate = await this.userRepository.findOne({
      where: { mail: dto.mail },
    });
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким mail уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hash = await this.hashService.hashPassword(dto.password);
    await this.userRepository.update(
      {
        name: dto.name,
        mail: dto.mail,
        passwordHash: hash.hash,
        passwordSalt: hash.salt,
      },
      { where: { id: dto.id } },
    );
  }
}
