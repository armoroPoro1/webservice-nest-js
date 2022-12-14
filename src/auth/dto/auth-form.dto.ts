import { IsString } from 'class-validator';
export class AuthFormDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
