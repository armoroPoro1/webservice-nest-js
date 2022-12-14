import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthFormDto } from './dto/auth-form.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  register(@Body() bodyUserRegister: UserDto) {
    const registerResult = this.authService.register(bodyUserRegister);
    return registerResult;
  }
  @Post('/login')
  login(@Body() bodyUserRegister: AuthFormDto) {
    const registerResult = this.authService.login(bodyUserRegister);
    return registerResult;
  }
}
