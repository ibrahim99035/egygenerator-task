import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address used at registration',
    format: 'email',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @ApiProperty({ example: 'Str0ng!Pass', description: 'Account password' })
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password!: string;
}
