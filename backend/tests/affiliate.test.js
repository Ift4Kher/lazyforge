import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { seedProducts } from '../src/database/seedProducts.js';
import { env } from '../src/config/env.js';

describe('LazyForge Affiliate & Referral Engine API', () => {
  let adminToken = '';
  let customerToken = '';
  let customerUser = null;
  let testReferralCode = 'AFF_' + Math.floor(100000 + Math.random() * 900000);
  let createdAffiliateId = null;

  beforeAll(async () => {
    // 1. Login Admin
    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@lazyforge.com', password: 'LazyForgeAdmin2026!' });
    adminToken = adminLogin.body.token;

    // 2. Register a customer
    const randomEmail = `affiliate_user_${Date.now()}@example.com`;
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Affiliate Creator',
        email: randomEmail,
        password: 'Password123!',
        phone: '01711223344',
      });
    customerToken = regRes.body.token;
    customerUser = regRes.body.user;
  });

  it('GET /api/v1/affiliates/track/:code returns 404 for unknown code', async () => {
    const res = await request(app).get('/api/v1/affiliates/track/NONEXISTENT999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/affiliates/register allows authenticated customer to become an affiliate', async () => {
    const res = await request(app)
      .post('/api/v1/affiliates/register')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ customCode: testReferralCode });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.affiliate.referralCode).toBe(testReferralCode);
    expect(res.body.affiliate.commissionRate).toBe(5.0);
    createdAffiliateId = res.body.affiliate.id;
  });

  it('GET /api/v1/affiliates/track/:code successfully validates the active referral code', async () => {
    const res = await request(app).get(`/api/v1/affiliates/track/${testReferralCode}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.affiliate.referralCode).toBe(testReferralCode);
    expect(res.body.affiliate.commissionRate).toBe(5.0);
  });

  it('POST /api/v1/orders with referral_code links affiliate and credits commission', async () => {
    // Fetch a product variant to order
    const catRes = await request(app).get('/api/v1/products');
    const product = catRes.body.products[0];
    const variantId = product.variants?.[0]?.id || null;

    const orderRes = await request(app)
      .post('/api/v1/orders')
      .send({
        customer_name: 'Referred Customer',
        customer_phone: '01899887766',
        customer_email: 'referred@example.com',
        delivery_address: 'House 42, Road 11, Banani, Dhaka',
        delivery_city: 'Dhaka',
        payment_method: 'COD',
        referral_code: testReferralCode,
        items: [
          {
            productId: product.id,
            variantId,
            quantity: 1,
          },
        ],
      });

    expect(orderRes.status).toBe(201);
    expect(orderRes.body.success).toBe(true);
    expect(orderRes.body.data.order.affiliateId).toBe(createdAffiliateId);
  });

  it('GET /api/v1/affiliates/me returns updated earnings and referral record', async () => {
    const res = await request(app)
      .get('/api/v1/affiliates/me')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.isAffiliate).toBe(true);
    expect(res.body.affiliate.totalEarned).toBeGreaterThan(0);
    expect(res.body.affiliate.balance).toBeGreaterThan(0);
    expect(res.body.referrals.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/admin/affiliates allows admin to view affiliate partners', async () => {
    const res = await request(app)
      .get('/api/v1/admin/affiliates')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.affiliates)).toBe(true);
    const found = res.body.affiliates.find((a) => a.referralCode === testReferralCode);
    expect(found).toBeDefined();
    expect(found.totalReferrals).toBeGreaterThan(0);
  });

  it('PATCH /api/v1/admin/affiliates/:id/status updates commission rate', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/affiliates/${createdAffiliateId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ commissionRate: 7.5 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
