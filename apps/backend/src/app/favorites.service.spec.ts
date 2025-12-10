import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { PrismaService } from '../prisma.service';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    favorite: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toggle', () => {
    it('should add event to favorites if not already favorited', async () => {
      mockPrismaService.favorite.findUnique.mockResolvedValue(null);
      mockPrismaService.favorite.create.mockResolvedValue({
        id: 1,
        userId: 1,
        eventId: 1,
      });

      const result = await service.toggle(1, 1);

      expect(result.isFavorite).toBe(true);
      expect(result.message).toBe('Added to favorites');
      expect(mockPrismaService.favorite.create).toHaveBeenCalledWith({
        data: { userId: 1, eventId: 1 },
      });
    });

    it('should remove event from favorites if already favorited', async () => {
      mockPrismaService.favorite.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
        eventId: 1,
      });
      mockPrismaService.favorite.delete.mockResolvedValue({});

      const result = await service.toggle(1, 1);

      expect(result.isFavorite).toBe(false);
      expect(result.message).toBe('Removed from favorites');
      expect(mockPrismaService.favorite.delete).toHaveBeenCalled();
    });
  });

  describe('findByUser', () => {
    it('should return user favorite events', async () => {
      const mockFavorites = [
        {
          id: 1,
          event: {
            id: 1,
            title: 'Test Event',
            category: { id: 1, name: 'Tech' },
            organizer: { id: 1, name: 'Organizer' },
            ticketTypes: [],
          },
        },
      ];

      mockPrismaService.favorite.findMany.mockResolvedValue(mockFavorites);

      const result = await service.findByUser(1);

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toHaveProperty('isFavorite', true);
      expect(mockPrismaService.favorite.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 1 },
        })
      );
    });
  });
});
