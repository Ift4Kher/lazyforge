import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { seedProducts } from '../src/database/seedProducts.js';
import { env } from '../src/config/env.js';

describe('LazyForge Customer Reviews Engine API', () => {
  let adminToken = '';
  let testProductId = null;
  let testReviewId = null;

  beforeAll(async () => {
    // Login Admin
    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@lazyforge.com', password: 'LazyForgeAdmin2026!' });
    adminToken = adminLogin.body.token;

    // Get a product
    const prodRes = await request(app).get('/api/v1/products');
    testProductId = prodRes.body.products[0].id;
  });

  it('POST /api/v1/products/:id/reviews rejects invalid rating', async () => {
    const res = await request(app)
      .post(`/api/v1/products/${testProductId}/reviews`)
      .send({
        customerName: 'Tanvir Ahmed',
        rating: 6,
        comment: 'Great robot, incredible build quality!',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/products/:id/reviews rejects comment shorter than 5 chars', async () => {
    const res = await request(app)
      .post(`/api/v1/products/${testProductId}/reviews`)
      .send({
        customerName: 'Tanvir Ahmed',
        rating: 5,
        comment: 'ok',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/products/:id/reviews successfully submits a customer review', async () => {
    const res = await request(app)
      .post(`/api/v1/products/${testProductId}/reviews`)
      .send({
        customerName: 'Rafiqul Islam',
        rating: 5,
        comment: 'Outstanding ESP32 controller responsiveness! Assembly took 45 minutes.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.review.rating).toBe(5);
    expect(res.body.review.customerName).toBe('Rafiqul Islam');
    testReviewId = res.body.review.id;
  });

  it('GET /api/v1/products/:id/reviews retrieves summary metrics and review list', async () => {
    const res = await request(app).get(`/api/v1/products/${testProductId}/reviews`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.summary.totalReviews).toBeGreaterThan(0);
    expect(res.body.summary.averageRating).toBeGreaterThanOrEqual(1);
    expect(res.body.summary.breakdown).toBeDefined();
    expect(Array.isArray(res.body.reviews)).toBe(true);
    const found = res.body.reviews.find((r) => r.id === testReviewId);
    expect(found).toBeDefined();
  });

  it('GET /api/v1/admin/reviews allows admin to view reviews across catalog', async () => {
    const res = await request(app)
      .get('/api/v1/admin/reviews')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.reviews)).toBe(true);
  });

  it('PATCH /api/v1/admin/reviews/:id/status updates moderation status', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/reviews/${testReviewId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'rejected' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it is excluded from public product reviews
    const publicRes = await request(app).get(`/api/v1/products/${testProductId}/reviews`);
    const found = publicRes.body.reviews.find((r) => r.id === testReviewId);
    expect(found).toBeUndefined();
  });

  it('DELETE /api/v1/admin/reviews/:id removes review permanently', async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/reviews/${testReviewId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
