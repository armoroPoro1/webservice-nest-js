import { IsString } from 'class-validator';
export class UserDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsString()
  firstname: string;
  @IsString()
  lastname: string;
}
