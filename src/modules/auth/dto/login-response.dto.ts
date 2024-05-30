import { User } from '@prisma/client';

export class LoginResponseDto {
  accessToken: string;
  user: Omit<User, 'password' | 'hashToken'>;
}
