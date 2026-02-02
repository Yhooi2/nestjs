import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { movieEntity } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(movieEntity)
    private readonly movieRepository: Repository<movieEntity>,
  ) {}

  async getAll(): Promise<movieEntity[]> {
    return await this.movieRepository.find({
      where: { isAvailable: true },
      order: { createdAt: 'desc' },
      select: { id: true, title: true },
    });
  }

  async findById(id: string): Promise<movieEntity> {
    const movie = await this.movieRepository.findOne({
      where: { id },
    });
    if (!movie) throw new NotFoundException('Фильм не найден');
    return movie;
  }

  async create(dto: CreateMovieDto): Promise<movieEntity> {
    const movie = this.movieRepository.create(dto);
    return await this.movieRepository.save(movie);
  }

  async update(id: string, dto: CreateMovieDto): Promise<movieEntity> {
    const movie = await this.findById(id);
    Object.assign(movie, dto);
    return await this.movieRepository.save(movie);
  }

  async delete(id: string): Promise<movieEntity> {
    const movie = await this.findById(id);
    await this.movieRepository.delete(id);
    return movie;
  }
}
