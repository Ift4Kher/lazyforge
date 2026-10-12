import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Admin Operations, Metrics & Management API', () => {
  let adminToken = '';

  beforeAll(async () => {
    // Authenticate as default admin
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@lazyforge.com', password: 'LazyForgeAdmin2026!' });

    adminToken = loginRes.body.token;
  });

  it('GET /api/v1/admin/stats rejects unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/v1/admin/stats');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/admin/stats returns telemetry metrics for authenticated admin', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orders).toBeDefined();
    expect(res.body.data.products).toBeDefined();
    expect(res.body.data.recentOrders).toBeInstanceOf(Array);
  });

  it('GET /api/v1/admin/orders lists paginated orders', async () => {
    const res = await request(app)
      .get('/api/v1/admin/orders?limit=5')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.pagination).toBeDefined();
  });

  it('GET /api/v1/admin/products returns all products with inventory info', async () => {
    const res = await request(app)
      .get('/api/v1/admin/products')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].total_stock).toBeDefined();
  });

  it('POST /api/v1/admin/products validates required fields', async () => {
    const res = await request(app)
      .post('/api/v1/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Incomplete Bot' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/admin/products creates a new product with default variant and initial stock', async () => {
    const uniqueSku = `TEST-ROBOT-${Date.now().toString().slice(-4)}`;
    const res = await request(app)
      .post('/api/v1/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'LazyForge Hexapod Swarm Scout',
        sku: uniqueSku,
        category_id: 1,
        regular_price: 18500,
        sale_price: 16900,
        short_description: 'Six-legged autonomous exploration unit.',
        stock_quantity: 12,
        image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.productId).toBeDefined();
  });
});
