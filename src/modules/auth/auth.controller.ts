import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterInputDto } from './dto/register-input.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ description: 'Register user' })
  @ApiBody({ type: RegisterInputDto })
  @ApiResponse({ type: RegisterResponseDto })
  async register(
    @Body() registerDto: RegisterInputDto,
  ): Promise<RegisterResponseDto> {
    return await this.authService.register(registerDto);
  }
}
