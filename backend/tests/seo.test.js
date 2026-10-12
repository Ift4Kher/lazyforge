import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Technical SEO & Search Crawler Integration API', () => {
  it('GET /sitemap.xml returns valid XML sitemap with product and category URLs', async () => {
    const res = await request(app).get('/sitemap.xml');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/xml');
    expect(res.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(res.text).toContain('<urlset');
    expect(res.text).toContain('https://lazyforge.com/');
    expect(res.text).toContain('https://lazyforge.com/products');
    expect(res.text).toContain('https://lazyforge.com/campaigns/robot-mascot');
  });

  it('GET /robots.txt serves directives for search crawlers with sitemap link', async () => {
    const res = await request(app).get('/robots.txt');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toContain('User-agent: *');
    expect(res.text).toContain('Disallow: /admin/');
    expect(res.text).toContain('Disallow: /api/');
    expect(res.text).toContain('Sitemap: https://lazyforge.com/sitemap.xml');
  });
});
