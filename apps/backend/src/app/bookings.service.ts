import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: any) {
    const { eventId, ticketTypeId, quantity } = data;

    // Fetch ticket type and event
    const ticketType = await this.prisma.ticketType.findUnique({
      where: { id: ticketTypeId },
      include: { event: true },
    });

    if (!ticketType) {
      throw new BadRequestException('Ticket type not found');
    }

    if (ticketType.available < quantity) {
      throw new BadRequestException('Not enough tickets available');
    }

    // Calculate total amount
    const totalAmount = ticketType.price * quantity;

    // Generate booking reference
    const bookingReference = `BK${Date.now()}${userId}`;

    // Calculate cancellation deadline (24 hours before event)
    const eventDate = new Date(ticketType.event.date);
    const cancellationDeadline = new Date(
      eventDate.getTime() - 24 * 60 * 60 * 1000
    );

    // Create booking and update available seats in a transaction
    const booking = await this.prisma.$transaction(async (tx) => {
      // Update ticket availability
      await tx.ticketType.update({
        where: { id: ticketTypeId },
        data: { available: { decrement: quantity } },
      });

      // Update event available seats
      await tx.event.update({
        where: { id: eventId },
        data: { availableSeats: { decrement: quantity } },
      });

      // Create booking
      return tx.booking.create({
        data: {
          userId,
          eventId,
          ticketTypeId,
          quantity,
          totalAmount,
          bookingReference,
          cancellationDeadline,
          status: 'confirmed',
          paymentStatus: 'completed',
        },
        include: {
          event: {
            include: {
              category: true,
              organizer: { select: { id: true, name: true, email: true } },
            },
          },
          ticketType: true,
        },
      });
    });

    return booking;
  }

  async findByUser(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            category: true,
            organizer: { select: { id: true, name: true, email: true } },
          },
        },
        ticketType: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    return this.prisma.booking.findFirst({
      where: { id, userId },
      include: {
        event: {
          include: {
            category: true,
            organizer: { select: { id: true, name: true, email: true } },
          },
        },
        ticketType: true,
      },
    });
  }

  async cancel(id: number, userId: number) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
      include: { ticketType: true, event: true },
    });

    if (!booking) {
      throw new BadRequestException('Booking not found');
    }

    if (booking.status === 'cancelled') {
      throw new BadRequestException('Booking already cancelled');
    }

    // Check if cancellation deadline has passed
    if (
      booking.cancellationDeadline &&
      new Date() > booking.cancellationDeadline
    ) {
      throw new BadRequestException('Cancellation deadline has passed');
    }

    // Cancel booking and restore availability in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Update ticket availability
      await tx.ticketType.update({
        where: { id: booking.ticketTypeId },
        data: { available: { increment: booking.quantity } },
      });

      // Update event available seats
      await tx.event.update({
        where: { id: booking.eventId },
        data: { availableSeats: { increment: booking.quantity } },
      });

      // Update booking status
      return tx.booking.update({
        where: { id },
        data: {
          status: 'cancelled',
          paymentStatus: 'refunded',
        },
      });
    });
  }
}
