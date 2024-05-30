import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';

export class UserResponse {
  @Expose()
  @ApiProperty()
  id: UUID;

  @Expose()
  @ApiProperty()
  firstName: string;

  @Expose()
  @ApiProperty()
  lastName: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  role: string;

  @Expose()
  @ApiProperty()
  phoneNumber: string;

  @Expose()
  @ApiProperty()
  status: number;
}
