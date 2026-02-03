import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MoviesService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getAll() {
    return this.moviesService.getAll();
  }
  @Get(':id')
  getById(@Param(':id') id: string) {
    return this.moviesService.findById(id);
  }
  @Post()
  create(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
    return this.moviesService.update(id, dto);
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.moviesService.delete(id);
  }
}
