import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    ticketType: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    event: {
      update: jest.fn(),
    },
    booking: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a booking successfully', async () => {
      const bookingData = {
        eventId: 1,
        ticketTypeId: 1,
        quantity: 2,
      };

      const mockTicketType = {
        id: 1,
        price: 100,
        available: 10,
        event: {
          id: 1,
          date: new Date('2025-12-01'),
        },
      };

      const mockBooking = {
        id: 1,
        userId: 1,
        eventId: 1,
        ticketTypeId: 1,
        quantity: 2,
        totalAmount: 200,
        bookingReference: 'BK123',
        status: 'confirmed',
      };

      mockPrismaService.ticketType.findUnique.mockResolvedValue(mockTicketType);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrismaService);
      });
      mockPrismaService.booking.create.mockResolvedValue(mockBooking);

      const result = await service.create(1, bookingData);

      expect(result).toBeDefined();
      expect(mockPrismaService.ticketType.findUnique).toHaveBeenCalled();
    });

    it('should throw error if ticket type not found', async () => {
      const bookingData = {
        eventId: 1,
        ticketTypeId: 999,
        quantity: 2,
      };

      mockPrismaService.ticketType.findUnique.mockResolvedValue(null);

      await expect(service.create(1, bookingData)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw error if not enough tickets available', async () => {
      const bookingData = {
        eventId: 1,
        ticketTypeId: 1,
        quantity: 20,
      };

      const mockTicketType = {
        id: 1,
        price: 100,
        available: 5,
        event: { id: 1, date: new Date() },
      };

      mockPrismaService.ticketType.findUnique.mockResolvedValue(mockTicketType);

      await expect(service.create(1, bookingData)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('findByUser', () => {
    it('should return user bookings', async () => {
      const mockBookings = [
        {
          id: 1,
          userId: 1,
          eventId: 1,
          quantity: 2,
          totalAmount: 200,
          event: { title: 'Test Event' },
          ticketType: { name: 'General' },
        },
      ];

      mockPrismaService.booking.findMany.mockResolvedValue(mockBookings);

      const result = await service.findByUser(1);

      expect(result).toEqual(mockBookings);
      expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 1 },
        })
      );
    });
  });

  describe('cancel', () => {
    it('should cancel booking successfully', async () => {
      const mockBooking = {
        id: 1,
        userId: 1,
        eventId: 1,
        ticketTypeId: 1,
        quantity: 2,
        status: 'confirmed',
        cancellationDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
      };

      mockPrismaService.booking.findFirst.mockResolvedValue(mockBooking);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrismaService);
      });
      mockPrismaService.booking.update.mockResolvedValue({
        ...mockBooking,
        status: 'cancelled',
      });

      const result = await service.cancel(1, 1);

      expect(result.status).toBe('cancelled');
      expect(mockPrismaService.booking.findFirst).toHaveBeenCalled();
    });

    it('should throw error if booking not found', async () => {
      mockPrismaService.booking.findFirst.mockResolvedValue(null);

      await expect(service.cancel(999, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if cancellation deadline passed', async () => {
      const mockBooking = {
        id: 1,
        userId: 1,
        status: 'confirmed',
        cancellationDeadline: new Date(Date.now() - 24 * 60 * 60 * 1000),
      };

      mockPrismaService.booking.findFirst.mockResolvedValue(mockBooking);

      await expect(service.cancel(1, 1)).rejects.toThrow(BadRequestException);
    });
  });
});
