import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ example: '82ut162tu162t' })
  id: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'test1@example.com' })
  email: string;

  @ApiProperty({ example: 'User' })
  role: string;

  @ApiProperty({ example: '0823716235123' })
  phoneNumber: string;

  @ApiProperty({ example: '1' })
  status: number;
}
