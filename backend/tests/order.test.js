import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { query } from '../src/config/database.js';

describe('LazyForge Orders & Commerce Engine', () => {
  let testProductId;
  let testVariantId;
  let testOrderNumber;

  beforeAll(async () => {
    // Fetch a test product with variant and active stock
    const products = await query(
      `SELECT p.id, p.name, v.id AS variant_id, v.stock_quantity, v.sku
       FROM products p
       JOIN product_variants v ON v.product_id = p.id
       WHERE v.stock_quantity >= 5 AND p.is_active = TRUE
       LIMIT 1`
    );

    if (products.length > 0) {
      testProductId = products[0].id;
      testVariantId = products[0].variant_id;
    }
  });

  it('GET /api/v1/orders/shipping-zones returns active Bangladesh shipping zones', async () => {
    const res = await request(app).get('/api/v1/orders/shipping-zones');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('fee');
  });

  it('POST /api/v1/orders rejects invalid Bangladesh phone number', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customer_name: 'Test Customer',
        customer_phone: '12345', // invalid
        delivery_address: 'House 12, Road 4, Dhanmondi',
        delivery_city: 'Dhaka',
        payment_method: 'COD',
        items: [{ productId: testProductId, variantId: testVariantId, quantity: 1 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Bangladesh mobile number');
  });

  it('POST /api/v1/orders rejects order if quantity exceeds stock', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customer_name: 'Overstock Tester',
        customer_phone: '01711223344',
        delivery_address: 'House 99, Gulshan 2',
        delivery_city: 'Dhaka',
        payment_method: 'COD',
        items: [{ productId: testProductId, variantId: testVariantId, quantity: 99999 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Insufficient stock');
  });

  it('POST /api/v1/orders places COD order, decrements stock, and returns order', async () => {
    const [beforeVariant] = await query(
      'SELECT stock_quantity FROM product_variants WHERE id = ?',
      [testVariantId]
    );
    const initialStock = beforeVariant.stock_quantity;

    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customer_name: 'Tariq Rahman',
        customer_phone: '01799887766',
        customer_email: 'tariq@example.com',
        delivery_address: 'Suite 401, Mirpur DOHS',
        delivery_city: 'Dhaka',
        delivery_zone_id: 1,
        payment_method: 'COD',
        notes: 'Please call before delivery',
        items: [{ productId: testProductId, variantId: testVariantId, quantity: 2 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.order).toHaveProperty('orderNumber');
    expect(res.body.data.order.paymentMethod).toBe('COD');
    expect(res.body.data.order.orderStatus).toBe('CONFIRMED');

    testOrderNumber = res.body.data.order.orderNumber;

    // Verify stock was decremented by 2
    const [afterVariant] = await query(
      'SELECT stock_quantity FROM product_variants WHERE id = ?',
      [testVariantId]
    );
    expect(afterVariant.stock_quantity).toBe(initialStock - 2);
  });

  it('GET /api/v1/orders/:orderNumber retrieves confirmed order details', async () => {
    expect(testOrderNumber).toBeDefined();

    const res = await request(app).get(`/api/v1/orders/${testOrderNumber}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.order_number).toBe(testOrderNumber);
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(res.body.data.items.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/orders creates SSLCommerz order and returns gateway URL', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customer_name: 'Nabila Karim',
        customer_phone: '01812345678',
        customer_email: 'nabila@example.com',
        delivery_address: 'Road 7, Sector 3, Uttara',
        delivery_city: 'Dhaka',
        delivery_zone_id: 1,
        payment_method: 'SSLCOMMERZ',
        items: [{ productId: testProductId, variantId: testVariantId, quantity: 1 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('gatewayUrl');
    expect(res.body.data.order.paymentMethod).toBe('SSLCOMMERZ');
    expect(res.body.data.order.paymentStatus).toBe('PENDING');

    const sslOrderNum = res.body.data.order.orderNumber;

    // Simulate SSLCommerz IPN webhook
    const ipnRes = await request(app)
      .post('/api/v1/payments/sslcommerz/ipn')
      .send({
        tran_id: sslOrderNum,
        val_id: `mock_val_${Date.now()}`,
        status: 'VALID',
      });

    expect(ipnRes.status).toBe(200);
    expect(ipnRes.body.success).toBe(true);

    // Verify order was marked PAID
    const [paidOrder] = await query(
      'SELECT payment_status, order_status FROM orders WHERE order_number = ?',
      [sslOrderNum]
    );
    expect(paidOrder.payment_status).toBe('PAID');
    expect(paidOrder.order_status).toBe('PROCESSING');
  });
});
