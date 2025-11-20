import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  async create(@Body() createBookingDto: any, @Req() req: any) {
    const userId = req.user?.sub || 1; // Get from JWT
    return this.bookingsService.create(userId, createBookingDto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user?.sub || 1; // Get from JWT
    return this.bookingsService.findByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.sub || 1; // Get from JWT
    return this.bookingsService.findOne(parseInt(id), userId);
  }

  @Delete(':id')
  async cancel(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.sub || 1; // Get from JWT
    return this.bookingsService.cancel(parseInt(id), userId);
  }
}
