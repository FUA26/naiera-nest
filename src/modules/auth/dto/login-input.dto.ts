import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginInputDto {
  @ApiProperty({ example: 'test1@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;
}
