jest.mock('@lib/prisma', () => ({
  PrismaService: jest.fn(),
}));

jest.mock('libs/prisma/generated/browser', () => ({
  PropertyType: {
    house: 'house',
    apartment: 'apartment',
    townhouse: 'townhouse',
    land: 'land',
    commercial: 'commercial',
  },
  Prisma: {},
}));

import { PrismaService } from '@lib/prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType } from 'libs/prisma/generated/browser';
import { AppService } from './app.service';

const mockFindMany = jest.fn();
const mockCount = jest.fn();

const mockPrismaService = {
  $transaction: jest.fn((fn) =>
    fn({
      property: {
        findMany: mockFindMany,
        count: mockCount,
      },
    }),
  ),
};

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AppService>(AppService);

    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);
  });

  afterEach(() => jest.clearAllMocks());

  const baseParams = {
    skip: 0,
    limit: 10,
    searchTerm: '',
    sortBy: 'createdAt',
    sortOrder: 'asc',
    propertyType: undefined,
    beds: undefined,
    baths: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    isAdmin: false,
  };

  // ── Test 1: response shape ─────────────────────────────────────────────────
  it('should return data and meta', async () => {
    mockFindMany.mockResolvedValue([
      { id: '1', title: 'Luxury Villa', price: 45000000 },
    ]);
    mockCount.mockResolvedValue(1);

    const result = await service.getListings(baseParams);

    expect(result).toEqual({
      data: [{ id: '1', title: 'Luxury Villa', price: 45000000 }],
      meta: { total: 1 },
    });
  });

  // ── Test 2: propertyType filter ────────────────────────────────────────────
  it('should apply propertyType filter when provided', async () => {
    await service.getListings({
      ...baseParams,
      propertyType: PropertyType.house,
    });

    const whereArg = mockFindMany.mock.calls[0][0].where;
    expect(whereArg.propertyType).toBe('house');
  });

  // ── Test 3: price range filter ─────────────────────────────────────────────
  it('should apply both gte and lte when minPrice and maxPrice are provided', async () => {
    await service.getListings({
      ...baseParams,
      minPrice: 5000000,
      maxPrice: 50000000,
    });

    const whereArg = mockFindMany.mock.calls[0][0].where;
    expect(whereArg.price).toEqual({ gte: 5000000, lte: 50000000 });
  });
});
