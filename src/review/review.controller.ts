import { Body, Controller, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewEntity } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() dto: CreateReviewDto): Promise<ReviewEntity> {
    return this.reviewService.create(dto);
  }
}
