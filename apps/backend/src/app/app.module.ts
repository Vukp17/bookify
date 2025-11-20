import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../prisma.service';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    EventsController,
    BookingsController,
    FavoritesController,
    ReviewsController,
  ],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    AuthService,
    EventsService,
    BookingsService,
    FavoritesService,
    ReviewsService,
  ],
})
export class AppModule {}