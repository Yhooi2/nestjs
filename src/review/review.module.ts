import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { MoviesModule } from 'src/movie/movie.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity]), MoviesModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
