import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // jwt
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(password, salt);

      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      // todo: return the jwt token
      await this.userRepository.save(user);

      delete user.password;

      return {
        ...user,
        token: this.#getJwtToken({
          id: user.id,
        }),
      };
    } catch (err) {
      this.#handleDBErrors(err);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      select: {
        email: true,
        password: true,
        id: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials (email)');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials (password)');
    }

    // todo: return the jwt token
    return {
      ...user,
      token: this.#getJwtToken({
        id: user.id,
      }),
    };
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.#getJwtToken({ id: user.id }),
    };
  }

  #getJwtToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return accessToken;
  }

  #handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Internal Server Error');
  }
}
