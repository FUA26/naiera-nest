import { Injectable } from '@nestjs/common';
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
}
