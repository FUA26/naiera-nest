import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { SharedModule } from 'src/share/module/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
