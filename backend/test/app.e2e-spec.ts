import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ── Test 1 ─────────────────────────────────────────────────────────────────

  it('GET /listings — should return paginated response shape', async () => {
    const res = await request(app.getHttpServer())
      .get('/listings?skip=0&limit=10&sortBy=createdAt&sortOrder=asc')
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');
    expect(res.body.meta).toHaveProperty('total');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // ── Test 2 ─────────────────────────────────────────────────────────────────

  it('GET /listings — should return only house type when filtered', async () => {
    const res = await request(app.getHttpServer())
      .get(
        '/listings?skip=0&limit=10&sortBy=createdAt&sortOrder=asc&propertyType=house',
      )
      .expect(200);

    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((property: any) => {
      expect(property.propertyType).toBe('house');
    });
  });

  // ── Test 3 ─────────────────────────────────────────────────────────────────

  it('GET /listings — should respect limit param', async () => {
    const res = await request(app.getHttpServer())
      .get('/listings?skip=0&limit=2&sortBy=createdAt&sortOrder=asc')
      .expect(200);

    expect(res.body.data.length).toBeLessThanOrEqual(2);
  });

  // ── Test 4 ─────────────────────────────────────────────────────────────────

  it('GET /listings — should filter by price range', async () => {
    const res = await request(app.getHttpServer())
      .get(
        '/listings?skip=0&limit=10&sortBy=price&sortOrder=asc&minPrice=10000000&maxPrice=30000000',
      )
      .expect(200);

    res.body.data.forEach((property: any) => {
      expect(Number(property.price)).toBeGreaterThanOrEqual(10000000);
      expect(Number(property.price)).toBeLessThanOrEqual(30000000);
    });
  });

  // ── Test 5 ─────────────────────────────────────────────────────────────────

  it('GET /listings — should return empty data for out of range price', async () => {
    const res = await request(app.getHttpServer())
      .get(
        '/listings?skip=0&limit=10&sortBy=createdAt&sortOrder=asc&minPrice=999999999',
      )
      .expect(200);

    expect(res.body.data).toHaveLength(0);
    expect(res.body.meta.total).toBe(0);
  });
});
