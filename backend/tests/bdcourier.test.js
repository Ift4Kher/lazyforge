import { describe, it, expect } from 'vitest';
import { sanitizeBDPhone, checkCustomerDelivery } from '../src/services/bdCourierService.js';

describe('BDCourier Courier Intelligence & Fraud Check Service', () => {
  it('correctly normalizes Bangladeshi mobile numbers', () => {
    expect(sanitizeBDPhone('+8801712345678')).toBe('01712345678');
    expect(sanitizeBDPhone('8801812345678')).toBe('01812345678');
    expect(sanitizeBDPhone('01912-345678')).toBe('01912345678');
    expect(sanitizeBDPhone('01512 345 678')).toBe('01512345678');
  });

  it('rejects invalid or too short phone numbers', async () => {
    const res = await checkCustomerDelivery('123');
    expect(res.success).toBe(false);
    expect(res.error).toContain('Invalid Bangladeshi phone number');
  });

  it('returns delivery statistics, risk levels, and courier breakdown for a valid phone', async () => {
    const res = await checkCustomerDelivery('01711223344');
    expect(res.success).toBe(true);
    expect(res.phone).toBe('01711223344');
    expect(typeof res.success_ratio).toBe('number');
    expect(['safe', 'medium', 'danger', 'low', 'high']).toContain(res.risk_level);
    expect(res.data).toBeDefined();
    expect(res.data.steadfast).toBeDefined();
    expect(res.data.pathao).toBeDefined();
    expect(res.data.redx).toBeDefined();
    expect(typeof res.data.steadfast.success_ratio).toBe('number');
  });
});
