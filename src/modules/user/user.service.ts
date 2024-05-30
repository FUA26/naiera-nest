import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/share/module/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AuthHelpers } from 'src/share/module/helpers/auth.helpers';
import { UserResponse } from './dto/user-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<UserResponse> {
    const checkUser = await this.prisma.user.findFirst({
      where: { email: data.email },
    });

    if (checkUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const encryptedPass = await AuthHelpers.doHash(data.password);

    const user = await this.prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: encryptedPass,
        hashToken: '',
      },
    });

    return plainToClass(UserResponse, user, {
      excludeExtraneousValues: true,
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
