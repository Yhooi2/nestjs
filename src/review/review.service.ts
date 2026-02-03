import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { MoviesService } from 'src/movie/movie.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly movieService: MoviesService,
  ) {}

  async create(dto: CreateReviewDto): Promise<ReviewEntity> {
    const { movieId, text, rating } = dto;
    const movie = await this.movieService.findById(movieId);
    const review = this.reviewRepository.create({
      text,
      rating,
      movie,
    });
    return await this.reviewRepository.save(review);
  }
}
