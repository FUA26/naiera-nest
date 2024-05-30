import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { RegisterInputDto } from './dto/register-input.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async register(createDto: RegisterInputDto): Promise<RegisterResponseDto> {
    return await this.userService.createUser(createDto);
  }
}
