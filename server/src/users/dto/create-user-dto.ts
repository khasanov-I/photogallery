export class AuthDto {
  readonly mail: string;
  readonly password: string;
}

export class CreateUserDto extends AuthDto {
  readonly name: string;
}

export class UpdateUserDto extends CreateUserDto {
  readonly id: number;
}
