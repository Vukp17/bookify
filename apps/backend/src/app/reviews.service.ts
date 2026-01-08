import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: any) {
    const { eventId, rating, comment } = data;

    // Check if user has already reviewed this event
    const existing = await this.prisma.review.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (existing) {
      throw new BadRequestException('You have already reviewed this event');
    }

    // Check if user has booked this event
    const booking = await this.prisma.booking.findFirst({
      where: {
        userId,
        eventId,
        status: { in: ['confirmed', 'completed'] },
      },
    });

    if (!booking) {
      throw new BadRequestException(
        'You can only review events you have booked'
      );
    }

    return this.prisma.review.create({
      data: {
        userId,
        eventId,
        rating,
        comment,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }

  async findByEvent(eventId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { eventId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      reviews,
      averageRating,
      totalReviews: reviews.length,
    };
  }
}
