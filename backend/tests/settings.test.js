import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Settings API & Hero Media Configuration', () => {
  it('GET /api/v1/settings/public should return hero configuration and shipping zones', async () => {
    const res = await request(app).get('/api/v1/settings/public');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const data = res.body.data;
    expect(data.hero).toBeDefined();
    expect(data.hero.mediaType).toBe('video');
    expect(data.hero.videoUrl).toBe('/uploads/hero-video.mp4');
    expect(data.general).toBeDefined();
    expect(data.general.currency).toBe('BDT');
    expect(Array.isArray(data.shippingZones)).toBe(true);
    expect(data.shippingZones.length).toBeGreaterThan(0);
  });
});
