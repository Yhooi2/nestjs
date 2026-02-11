import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ActorService } from 'src/actor/actor.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    private readonly actorService: ActorService,
  ) {}

  async getAll(): Promise<MovieEntity[]> {
    return await this.movieRepository.find({
      where: { isAvailable: true },
      order: { createdAt: 'desc' },
      select: { id: true, title: true },
    });
  }

  async findById(id: string): Promise<MovieEntity> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: { actors: true },
    });
    if (!movie) throw new NotFoundException('Фильм не найден');
    return movie;
  }

  async create(dto: CreateMovieDto): Promise<MovieEntity> {
    const { title, releaseYear, actorsIds } = dto;
    const actors = await this.actorService.findByIds(actorsIds);
    if (!actors) throw new NotFoundException('Актеры не найдены');
    const movie = this.movieRepository.create({ title, releaseYear, actors });
    return await this.movieRepository.save(movie);
  }

  async update(id: string, dto: UpdateMovieDto): Promise<MovieEntity> {
    const movie = await this.movieRepository.preload({ id, ...dto });
    if (!movie) throw new NotFoundException('Фильм не найден');
    return await this.movieRepository.save(movie);
  }

  async delete(id: string): Promise<MovieEntity> {
    const movie = await this.findById(id);
    await this.movieRepository.delete(id);
    return movie;
  }
}
