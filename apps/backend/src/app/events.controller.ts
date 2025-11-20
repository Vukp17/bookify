import { Controller, Get, Post, Body, Param, Query, Req } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.eventsService.findAll(query);
  }

  @Get('categories')
  async getCategories() {
    return this.eventsService.getCategories();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.sub; // From JWT if authenticated
    return this.eventsService.findOne(parseInt(id), userId);
  }

  @Post()
  async create(@Body() createEventDto: any, @Req() req: any) {
    const organizerId = req.user?.sub || 1; // Get from JWT
    return this.eventsService.createEvent(createEventDto, organizerId);
  }
}
