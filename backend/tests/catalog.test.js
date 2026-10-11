import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { seedProducts } from '../src/database/seedProducts.js';
import { env } from '../src/config/env.js';

describe('LazyForge Catalog & Products API', () => {
  beforeAll(async () => {
    // Ensure test database is seeded with products
    await seedProducts(env.DB.testDatabase);
  });

  it('GET /api/v1/categories returns category listing with counts', async () => {
    const res = await request(app).get('/api/v1/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(0);
    expect(res.body.categories[0]).toHaveProperty('slug');
    expect(res.body.categories[0]).toHaveProperty('product_count');
  });

  it('GET /api/v1/products returns paginated products', async () => {
    const res = await request(app).get('/api/v1/products?page=1&limit=6');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeLessThanOrEqual(6);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.total).toBeGreaterThan(0);
  });

  it('GET /api/v1/products with category filter returns matching products', async () => {
    const res = await request(app).get('/api/v1/products?category=robotics-kits');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
    for (const p of res.body.products) {
      expect(p.category_slug).toBe('robotics-kits');
    }
  });

  it('GET /api/v1/products with search term filters products', async () => {
    const res = await request(app).get('/api/v1/products?search=Spider');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
    expect(res.body.products[0].name.toLowerCase()).toContain('spider');
  });

  it('GET /api/v1/products/featured returns featured items', async () => {
    const res = await request(app).get('/api/v1/products/featured');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
    for (const p of res.body.products) {
      expect(p.is_featured).toBeTruthy();
    }
  });

  it('GET /api/v1/products/:slug returns full details including variants and gallery', async () => {
    const slug = 'esp32-autonomous-quadruped-spider-robot-kit';
    const res = await request(app).get(`/api/v1/products/${slug}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.product).toBeDefined();
    expect(res.body.product.slug).toBe(slug);
    expect(Array.isArray(res.body.product.images)).toBe(true);
    expect(Array.isArray(res.body.product.variants)).toBe(true);
    expect(res.body.product.variants.length).toBeGreaterThan(0);
    expect(typeof res.body.product.specifications).toBe('object');
  });

  it('GET /api/v1/products/:slug returns 404 for unknown slug', async () => {
    const res = await request(app).get('/api/v1/products/unknown-non-existent-item');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
