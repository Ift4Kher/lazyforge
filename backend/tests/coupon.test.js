import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('LazyForge Coupon & Discount Engine API', () => {
  it('POST /api/v1/coupons/validate returns 400 if code or subtotal missing', async () => {
    const res = await request(app)
      .post('/api/v1/coupons/validate')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/coupons/validate returns 404 for unknown coupon code', async () => {
    const res = await request(app)
      .post('/api/v1/coupons/validate')
      .send({ code: 'INVALIDCODE999', subtotal: 5000 });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/coupons/validate rejects when subtotal below minimum requirement', async () => {
    // FORGE500 requires minimum order ৳3500
    const res = await request(app)
      .post('/api/v1/coupons/validate')
      .send({ code: 'FORGE500', subtotal: 2000 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Minimum order amount');
  });

  it('POST /api/v1/coupons/validate correctly calculates percentage discount (LAZYBOT10)', async () => {
    const res = await request(app)
      .post('/api/v1/coupons/validate')
      .send({ code: 'LAZYBOT10', subtotal: 5000 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toBe('LAZYBOT10');
    expect(res.body.data.discountAmount).toBe(500); // 10% of 5000 = 500
    expect(res.body.data.discountedSubtotal).toBe(4500);
  });

  it('POST /api/v1/coupons/validate correctly applies fixed discount (FORGE500)', async () => {
    const res = await request(app)
      .post('/api/v1/coupons/validate')
      .send({ code: 'FORGE500', subtotal: 4000 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.discountAmount).toBe(500);
    expect(res.body.data.discountedSubtotal).toBe(3500);
  });
});
