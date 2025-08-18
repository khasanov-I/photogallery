export class CreateUserDto {
  readonly name: string;
  readonly mail: string;
  readonly password: string;
}

export class AuthDto {
  readonly mail: string;
  readonly password: string;
}
