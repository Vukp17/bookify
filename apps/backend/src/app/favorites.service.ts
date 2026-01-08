import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: number, eventId: number) {
    // Check if favorite already exists
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (existing) {
      // Remove favorite
      await this.prisma.favorite.delete({
        where: { id: existing.id },
      });
      return { isFavorite: false, message: 'Removed from favorites' };
    } else {
      // Add favorite
      await this.prisma.favorite.create({
        data: { userId, eventId },
      });
      return { isFavorite: true, message: 'Added to favorites' };
    }
  }

  async findByUser(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            category: true,
            organizer: { select: { id: true, name: true, email: true } },
            ticketTypes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((fav: any) => ({
      ...fav.event,
      isFavorite: true,
    }));
  }
}
