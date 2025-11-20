import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  async create(@Body() createReviewDto: any, @Req() req: any) {
    const userId = req.user?.sub || 1; // Get from JWT
    return this.reviewsService.create(userId, createReviewDto);
  }

  @Get('event/:eventId')
  async findByEvent(@Param('eventId') eventId: string) {
    return this.reviewsService.findByEvent(parseInt(eventId));
  }
}
