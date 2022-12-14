import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthFormDto } from './dto/auth-form.dto';

import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  private saltOrRounds = 10;
  private accessTokenBack;
  async register(user: UserDto) {
    // start find exit username
    const users = await this.userRepository.findOne({
      where: { username: user.username },
    });
    // end find exit username
    if (users) {
      throw new HttpException(`Username is already.`, HttpStatus.BAD_REQUEST);
    } else {
      //start create new user
      const userEntity = new User();
      userEntity.username = user.username;
      userEntity.password = await bcrypt.hash(user.password, this.saltOrRounds);
      userEntity.firstname = user.firstname;
      userEntity.lastname = user.lastname;
      const result = await this.userRepository.save(userEntity);
      //end create new user
      return {
        message: `Register success.`,
      };
    }
  }
  async login(user: AuthFormDto) {
    // start find exit username
    const users = await this.userRepository.findOne({
      where: { username: user.username },
    });
    // end find exit username
    if (users) {
      //start check password
      const checkPassword = await bcrypt.compare(user.password, users.password);
      //end check password
      if (checkPassword) {
        const payload = {
          username: users.username,
          userId: users.id,
        };
        const iat = new Date();
        const tokenLifeTimeInMS =
          Number(process.env.JWT_EXR_TIME_SECOND || 3600) * 1000;
        const exp = new Date(iat.getTime() + tokenLifeTimeInMS);
        const accessToken = this.jwtService.sign(payload);
        this.accessTokenBack = accessToken;
        return {
          accessToken,
          iat,
          exp,
        };
      } else {
        throw new HttpException(
          `Password is incorrect.`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(`Username is incorrect.`, HttpStatus.BAD_REQUEST);
    }
  }
}
