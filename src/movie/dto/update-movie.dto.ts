import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @IsOptional()
  @IsInt()
  @Min(1988)
  @Max(new Date().getFullYear())
  releaseYear?: number;
}
