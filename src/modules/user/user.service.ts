import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/share/module/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { AuthHelpers } from 'src/share/module/helpers/auth.helpers';
import { UserResponse } from './dto/user-response.dto';
import { plainToClass } from 'class-transformer';
import { CleanUser } from 'src/share/dto/user.dto';

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

    return plainToClass(CleanUser, user, {
      excludeExtraneousValues: true,
    });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const getUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!getUser) {
      throw new HttpException(
        'Email and Password Do Not Match',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isValidPassword = await AuthHelpers.verify(
      password,
      getUser.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        'Email and Password Do Not Match',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return getUser;
  }

  async validateUserId(sub: string): Promise<User> {
    const getUser = await this.prisma.user.findFirst({
      where: { id: sub },
    });

    return getUser;
  }

  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    try {
      const updatedUser = await this.prisma.user.update({
        where,
        data,
      });

      return updatedUser;
    } catch (error) {
      throw new Error(`Could not update user: ${error.message}`);
    }
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
