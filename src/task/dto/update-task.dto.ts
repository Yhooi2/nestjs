import { IsBoolean, IsString, Length } from 'class-validator';

export class UpdateTaskDto {
  @IsString({ message: 'Title must be a string' })
  @Length(2, 40)
  title: string;
  @IsBoolean({ message: 'isComplate must be a boolean' })
  isComplate: boolean;
}
