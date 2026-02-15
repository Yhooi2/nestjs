import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'exemple@exemple.com',
    description: 'The email of the user',
    maxLength: 50,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description:
      'The password of the user. Must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 128)
  @IsStrongPassword()
  password: string;
}
