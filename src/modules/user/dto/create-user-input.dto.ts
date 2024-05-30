import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInputDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'John', description: 'Nama depan pengguna' })
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Doe', description: 'Nama belakang pengguna' })
  lastName: string;

  @IsEmail()
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email pengguna',
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'password123',
    description: 'Kata sandi pengguna',
    required: false,
  })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'abc123xyz',
    description: 'Token hash pengguna',
    required: false,
  })
  hashToken?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'admin', description: 'Peran pengguna' })
  role: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '+6281234567890',
    description: 'Nomor telepon pengguna',
    required: false,
  })
  phoneNumber?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, description: 'Status pengguna', required: false })
  status?: number;
}
