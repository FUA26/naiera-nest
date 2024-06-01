import {
  Controller,
  Post,
  Body,
  Response,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterInputDto } from './dto/register-input.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginInputDto } from './dto/login-input.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { MAX_AGE } from 'src/share/constants/auth.constants';
import { JwtRefreshGuard } from 'src/share/guards/jwt-refresh.guard';

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

  @Post('login')
  @ApiOperation({ description: 'Login user' })
  @ApiBody({ type: LoginInputDto })
  @ApiResponse({ type: LoginResponseDto })
  async login(
    @Body() loginDto: LoginInputDto,
    @Response() res,
  ): Promise<LoginResponseDto> {
    const userData = await this.authService.validateLogin(loginDto);
    res.cookie('RefreshToken', userData.refreshToken, {
      httpOnly: true,
      maxAge: Number(MAX_AGE) * 1000,
    });

    return res.send({
      user: userData.data,
      accessToken: userData.accessToken,
    });
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ description: 'Refresh Token' })
  async refresh(@Request() req, @Response() res) {
    const user = req.user;
    const token = await this.authService.validateRefreshToken(
      user.sub,
      req.cookies['RefreshToken'],
    );

    return res.send({ accessToken: token.accessToken });
  }

  @Post('logout')
  @ApiOperation({ description: 'Logout' })
  @UseGuards(JwtRefreshGuard)
  async logout(@Request() req, @Response() res): Promise<any> {
    const user = req.user;
    await this.authService.removeRefreshToken(user.sub);
    res.clearCookie('RefreshToken', {
      httpOnly: true,
      maxAge: 0,
    });

    return res.status(200).send({ message: 'Logout successful' });
  }
}
