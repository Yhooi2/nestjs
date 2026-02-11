import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1988)
  @Max(new Date().getFullYear())
  releaseYear: number;

  @IsArray()
  @IsUUID(4, { each: true })
  actorsIds: string[];
}
