import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from 'src/share/types/auth.types';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(
  Strategy,
  'jwt-auth-token',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret'),
    });
  }

  public validate(payload: IJwtPayload): IJwtPayload {
    if (!payload.sub) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
