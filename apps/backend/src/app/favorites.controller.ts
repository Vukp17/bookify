import { Controller, Get, Post, Param, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user?.sub || 1; // Get from JWT
    return this.favoritesService.findByUser(userId);
  }

  @Post(':eventId')
  async toggle(@Param('eventId') eventId: string, @Req() req: any) {
    const userId = req.user?.sub || 1; // Get from JWT
    return this.favoritesService.toggle(userId, parseInt(eventId));
  }
}
