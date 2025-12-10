import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    review: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    booking: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a review successfully', async () => {
      const reviewData = {
        eventId: 1,
        rating: 5,
        comment: 'Great event!',
      };

      mockPrismaService.review.findUnique.mockResolvedValue(null);
      mockPrismaService.booking.findFirst.mockResolvedValue({
        id: 1,
        userId: 1,
        eventId: 1,
        status: 'confirmed',
      });
      mockPrismaService.review.create.mockResolvedValue({
        id: 1,
        userId: 1,
        ...reviewData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(1, reviewData);

      expect(result).toBeDefined();
      expect(result.rating).toBe(5);
      expect(mockPrismaService.review.create).toHaveBeenCalled();
    });

    it('should throw error if user already reviewed event', async () => {
      const reviewData = {
        eventId: 1,
        rating: 5,
        comment: 'Great event!',
      };

      mockPrismaService.review.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
        eventId: 1,
      });

      await expect(service.create(1, reviewData)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw error if user has not booked the event', async () => {
      const reviewData = {
        eventId: 1,
        rating: 5,
        comment: 'Great event!',
      };

      mockPrismaService.review.findUnique.mockResolvedValue(null);
      mockPrismaService.booking.findFirst.mockResolvedValue(null);

      await expect(service.create(1, reviewData)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('findByEvent', () => {
    it('should return event reviews with average rating', async () => {
      const mockReviews = [
        {
          id: 1,
          eventId: 1,
          userId: 1,
          rating: 5,
          comment: 'Great!',
          user: { id: 1, name: 'User1' },
        },
        {
          id: 2,
          eventId: 1,
          userId: 2,
          rating: 4,
          comment: 'Good!',
          user: { id: 2, name: 'User2' },
        },
      ];

      mockPrismaService.review.findMany.mockResolvedValue(mockReviews);

      const result = await service.findByEvent(1);

      expect(result.reviews).toEqual(mockReviews);
      expect(result.averageRating).toBe(4.5);
      expect(result.totalReviews).toBe(2);
    });

    it('should return 0 average rating if no reviews', async () => {
      mockPrismaService.review.findMany.mockResolvedValue([]);

      const result = await service.findByEvent(1);

      expect(result.averageRating).toBe(0);
      expect(result.totalReviews).toBe(0);
    });
  });
});
