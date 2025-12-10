import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma.service';

describe('EventsService', () => {
  let service: EventsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    event: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
    },
    favorite: {
      findUnique: jest.fn(),
    },
    review: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return array of events', async () => {
      const mockEvents = [
        {
          id: 1,
          title: 'Test Event',
          date: new Date(),
          category: { id: 1, name: 'Technology' },
          organizer: { id: 1, name: 'Organizer' },
          ticketTypes: [],
          _count: { reviews: 0 },
        },
      ];

      mockPrismaService.event.findMany.mockResolvedValue(mockEvents);
      mockPrismaService.review.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(mockPrismaService.event.findMany).toHaveBeenCalled();
    });

    it('should filter events by search term', async () => {
      const filters = { search: 'Tech' };
      mockPrismaService.event.findMany.mockResolvedValue([]);
      mockPrismaService.review.findMany.mockResolvedValue([]);

      await service.findAll(filters);

      expect(mockPrismaService.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
          }),
        })
      );
    });

    it('should filter events by category', async () => {
      const filters = { category: '1' };
      mockPrismaService.event.findMany.mockResolvedValue([]);
      mockPrismaService.review.findMany.mockResolvedValue([]);

      await service.findAll(filters);

      expect(mockPrismaService.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            categoryId: 1,
          }),
        })
      );
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      const mockEvent = {
        id: 1,
        title: 'Test Event',
        category: { id: 1, name: 'Technology' },
        organizer: { id: 1, name: 'Organizer' },
        ticketTypes: [],
        reviews: [],
      };

      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.favorite.findUnique.mockResolvedValue(null);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
        })
      );
    });

    it('should return null if event not found', async () => {
      mockPrismaService.event.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });

    it('should include favorite status for authenticated user', async () => {
      const mockEvent = {
        id: 1,
        title: 'Test Event',
        category: { id: 1, name: 'Technology' },
        organizer: { id: 1, name: 'Organizer' },
        ticketTypes: [],
        reviews: [],
      };

      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.favorite.findUnique.mockResolvedValue({ id: 1 });

      const result = await service.findOne(1, 1);

      expect(result.isFavorite).toBe(true);
    });
  });

  describe('getCategories', () => {
    it('should return array of categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Technology' },
        { id: 2, name: 'Business' },
      ];

      mockPrismaService.category.findMany.mockResolvedValue(mockCategories);

      const result = await service.getCategories();

      expect(result).toEqual(mockCategories);
      expect(mockPrismaService.category.findMany).toHaveBeenCalled();
    });
  });
});
