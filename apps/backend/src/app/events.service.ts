import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: any) {
    const where: any = {
      status: 'published',
    };

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.category) {
      where.categoryId = parseInt(filters.category);
    }

    if (filters?.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }

    const events = await this.prisma.event.findMany({
      where,
      include: {
        category: true,
        organizer: { select: { id: true, name: true, email: true } },
        ticketTypes: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { date: 'asc' },
    });

    // Calculate average rating for each event
    const eventsWithRatings = await Promise.all(
      events.map(async (event) => {
        const reviews = await this.prisma.review.findMany({
          where: { eventId: event.id },
          select: { rating: true },
        });

        const averageRating =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        return {
          ...event,
          averageRating,
          reviewCount: reviews.length,
        };
      })
    );

    return eventsWithRatings;
  }

  async findOne(id: number, userId?: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        organizer: { select: { id: true, name: true, email: true } },
        ticketTypes: true,
        reviews: {
          include: { user: { select: { id: true, name: true } } },
        },
      },
    });

    if (!event) return null;

    // Check if user has favorited this event
    let isFavorite = false;
    if (userId) {
      const favorite = await this.prisma.favorite.findUnique({
        where: { userId_eventId: { userId, eventId: id } },
      });
      isFavorite = !!favorite;
    }

    // Calculate average rating
    const averageRating =
      event.reviews.length > 0
        ? event.reviews.reduce((sum, r) => sum + r.rating, 0) /
          event.reviews.length
        : 0;

    return {
      ...event,
      isFavorite,
      averageRating,
      reviewCount: event.reviews.length,
    };
  }

  async getCategories() {
    return this.prisma.category.findMany();
  }

  async createEvent(data: any, organizerId: number) {
    const { ticketTypes, categoryId, ...eventData } = data;

    return this.prisma.event.create({
      data: {
        ...eventData,
        organizerId,
        categoryId: parseInt(categoryId),
        ticketTypes: {
          create: ticketTypes.map((tt: any) => ({
            ...tt,
            available: tt.quantity,
          })),
        },
      },
      include: {
        category: true,
        ticketTypes: true,
      },
    });
  }
}
