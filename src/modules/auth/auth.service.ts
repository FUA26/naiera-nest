import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { RegisterInputDto } from './dto/register-input.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginInputDto } from './dto/login-input.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthHelpers } from 'src/share/module/helpers/auth.helpers';
import { IJwtPayload, IJwtToken } from 'src/share/types/auth.types';
import { plainToClass } from 'class-transformer';
import { CleanUser } from 'src/share/dto/user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async register(createDto: RegisterInputDto): Promise<RegisterResponseDto> {
    return await this.userService.createUser(createDto);
  }

  async validateLogin(loginDto: LoginInputDto) {
    const user = await this.userService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    const payload = {
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    const token = await this.getJwtToken(payload);
    const hashedToken = await AuthHelpers.doHash(token.refreshToken);
    const updatedUser = await this.userService.updateUser(
      {
        id: user.id,
      },
      {
        hashToken: hashedToken,
      },
    );

    return {
      data: plainToClass(CleanUser, updatedUser, {
        excludeExtraneousValues: true,
      }),
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  private async getJwtToken(user: IJwtPayload): Promise<IJwtToken> {
    const payload = {
      ...user,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload),
      this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: this.configService.get('auth.refresh_exp'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateRefreshToken(sub, token): Promise<any> {
    const getUser = await this.userService.validateUserId(sub);

    const isValidToken = await AuthHelpers.verify(token, getUser.hashToken);

    // const isValidToken = await bcrypt.compare(token, user.hashToken);
    // console.log(isValidToken);

    if (!isValidToken) {
      throw new HttpException('Token Expired', HttpStatus.UNAUTHORIZED);
    }

    const payload = {
      sub: getUser.id,
      firstName: getUser.firstName,
      lastName: getUser.lastName,
      email: getUser.email,
      role: getUser.role,
    };

    const tokens = await this.getJwtToken(payload);

    return {
      accessToken: tokens.accessToken,
    };
  }

  async removeRefreshToken(sub: string): Promise<User> {
    return await this.userService.updateUser(
      { id: sub },
      {
        hashToken: null,
      },
    );
  }
}
