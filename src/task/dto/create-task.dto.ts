import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
  // MaxLength,
  // MinLength,
} from 'class-validator';
import { TaskTags } from '../shemas';

export class CreateTaskDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  // @MinLength(2)
  // @MaxLength(40)
  @Length(2, 40)
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description: string;

  @IsOptional()
  @IsPositive({ message: 'Priority must be a positive number' })
  @IsNumber({}, { message: 'Priority must be a number' })
  @IsInt({ message: 'Priority must be a intager' })
  priority: number;

  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @IsEnum(TaskTags, { message: 'Invalid tag', each: true })
  tags: TaskTags[];

  @IsString({ message: 'Password must be a string' })
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Password too weak',
  })
  password: string;

  @IsString({ message: 'WebsiteUrl must be a string' })
  @IsUrl(
    {
      protocols: ['https', 'wss'],
      require_protocol: true,
      host_whitelist: ['google.com', 'youtobe.com'],
      host_blacklist: ['ya.ru', 'vk.com', 'yandex.ru'],
    },
    { message: 'WebsiteUrl must be a valid URL' },
  )
  websiteUrl: string;

  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  userId: string;
}
