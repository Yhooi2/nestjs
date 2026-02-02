import { Module } from '@nestjs/common';
import { MoviesService } from './movie.service';
import { MoviesController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { movieEntity } from './entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([movieEntity])],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
