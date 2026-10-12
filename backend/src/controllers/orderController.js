import { query, transaction } from '../config/database.js';
import { sslcommerzService } from '../services/sslcommerzService.js';

// Bangladesh phone number regex: +8801XXXXXXXXX or 01XXXXXXXXX (11 digits starting with 013-019)
const BD_PHONE_REGEX = /^(?:\+8801|01)[3-9]\d{8}$/;

/**
 * Generate unique order number
 */
function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `LF-${dateStr}-${randomSuffix}`;
}

export const orderController = {
  /**
   * Get all active shipping zones
   * GET /api/v1/orders/shipping-zones
   */
  async getShippingZones(req, res, next) {
    try {
      const zones = await query(
        'SELECT id, name, fee, estimated_days FROM shipping_zones WHERE is_active = TRUE ORDER BY fee ASC'
      );
      res.json({ success: true, data: zones });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Place an order with concurrency-safe stock deduction and price verification
   * POST /api/v1/orders
   */
  async createOrder(req, res, next) {
    try {
      const {
        customer_name,
        customer_phone,
        customer_email,
        delivery_address,
        delivery_city,
        delivery_zone_id,
        items,
        payment_method = 'COD',
        notes,
        coupon_code,
        couponCode,
        referral_code,
        referralCode,
        affiliate_code,
      } = req.body;

      // 1. Validation
      if (!customer_name || customer_name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Customer name is required (minimum 2 characters)',
        });
      }

      if (!customer_phone || !BD_PHONE_REGEX.test(customer_phone.replace(/\s+/g, ''))) {
        return res.status(400).json({
          success: false,
          error: 'Valid Bangladesh mobile number is required (e.g., 017XXXXXXXX or +88017XXXXXXXX)',
        });
      }

      if (!delivery_address || delivery_address.trim().length < 5) {
        return res.status(400).json({
          success: false,
          error: 'Detailed delivery address is required (minimum 5 characters)',
        });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Order must contain at least one product item',
        });
      }

      const normalizedPayment = payment_method.toUpperCase();
      if (!['COD', 'SSLCOMMERZ'].includes(normalizedPayment)) {
        return res.status(400).json({
          success: false,
          error: 'Payment method must be either "COD" or "SSLCOMMERZ"',
        });
      }

      // 2. Resolve Shipping Zone
      let shippingFee = 80.0; // Default Inside Dhaka
      let resolvedZoneId = delivery_zone_id || null;

      if (delivery_zone_id) {
        const zones = await query(
          'SELECT id, fee FROM shipping_zones WHERE id = ? AND is_active = TRUE',
          [delivery_zone_id]
        );
        if (zones.length > 0) {
          shippingFee = Number(zones[0].fee);
          resolvedZoneId = zones[0].id;
        }
      }

      // 3. Concurrency-Safe Transaction: Verify stock, calculate verified subtotal, deduct inventory
      const orderResult = await transaction(async (conn) => {
        let calculatedSubtotal = 0;
        const verifiedItems = [];

        for (const item of items) {
          const qty = parseInt(item.quantity, 10);
          if (isNaN(qty) || qty <= 0) {
            const err = new Error(`Invalid quantity for item ${item.productId}`);
            err.statusCode = 400;
            throw err;
          }

          let unitPrice = 0;
          let productName = '';
          let variantName = null;
          let sku = '';
          let variantId = item.variantId || null;

          if (variantId) {
            // Lock variant row with SELECT ... FOR UPDATE
            const [variants] = await conn.query(
              `SELECT v.id, v.product_id, v.sku, v.variant_name, v.price_adjustment, v.stock_quantity,
                      p.name AS product_name, p.regular_price, p.sale_price, p.is_active
               FROM product_variants v
               JOIN products p ON v.product_id = p.id
               WHERE v.id = ? FOR UPDATE`,
              [variantId]
            );

            if (variants.length === 0) {
              const err = new Error(`Variant #${variantId} not found`);
              err.statusCode = 400;
              throw err;
            }

            const v = variants[0];
            if (!v.is_active) {
              const err = new Error(`Product "${v.product_name}" is currently unavailable`);
              err.statusCode = 400;
              throw err;
            }

            if (v.stock_quantity < qty) {
              const err = new Error(
                `Insufficient stock for "${v.product_name} (${v.variant_name})". Available: ${v.stock_quantity}`
              );
              err.statusCode = 400;
              throw err;
            }

            // Deduct inventory
            await conn.query(
              'UPDATE product_variants SET stock_quantity = stock_quantity - ? WHERE id = ?',
              [qty, variantId]
            );

            const basePrice = v.sale_price !== null ? Number(v.sale_price) : Number(v.regular_price);
            unitPrice = basePrice + Number(v.price_adjustment || 0);
            productName = v.product_name;
            variantName = v.variant_name;
            sku = v.sku;

            // Audit log
            await conn.query(
              `INSERT INTO inventory_logs (variant_id, change_amount, reason)
               VALUES (?, ?, ?)`,
              [variantId, -qty, 'ORDER_RESERVATION']
            );
          } else {
            // Product without variants (or query default variant)
            const [products] = await conn.query(
              `SELECT p.id, p.name, p.sku, p.regular_price, p.sale_price, p.is_active
               FROM products p WHERE p.id = ? FOR UPDATE`,
              [item.productId]
            );

            if (products.length === 0) {
              const err = new Error(`Product #${item.productId} not found`);
              err.statusCode = 400;
              throw err;
            }

            const p = products[0];
            if (!p.is_active) {
              const err = new Error(`Product "${p.name}" is currently unavailable`);
              err.statusCode = 400;
              throw err;
            }

            // Check if there are variants, lock first active variant
            const [firstVariant] = await conn.query(
              'SELECT id, sku, variant_name, stock_quantity FROM product_variants WHERE product_id = ? AND is_active = TRUE LIMIT 1 FOR UPDATE',
              [p.id]
            );

            if (firstVariant.length > 0) {
              const fv = firstVariant[0];
              if (fv.stock_quantity < qty) {
                const err = new Error(`Insufficient stock for "${p.name}". Available: ${fv.stock_quantity}`);
                err.statusCode = 400;
                throw err;
              }

              await conn.query(
                'UPDATE product_variants SET stock_quantity = stock_quantity - ? WHERE id = ?',
                [qty, fv.id]
              );

              variantId = fv.id;
              sku = fv.sku;
              variantName = fv.variant_name;

              await conn.query(
                `INSERT INTO inventory_logs (variant_id, change_amount, reason)
                 VALUES (?, ?, ?)`,
                [fv.id, -qty, 'ORDER_RESERVATION']
              );
            } else {
              sku = p.sku;
            }

            unitPrice = p.sale_price !== null ? Number(p.sale_price) : Number(p.regular_price);
            productName = p.name;
          }

          const itemTotal = unitPrice * qty;
          calculatedSubtotal += itemTotal;

          verifiedItems.push({
            productId: item.productId,
            variantId,
            productName,
            variantName,
            sku,
            unitPrice,
            quantity: qty,
            totalPrice: itemTotal,
          });
        }

        // Calculate Coupon Discount
        let couponId = null;
        let discountAmount = 0.0;
        const rawCoupon = (coupon_code || couponCode || '').trim().toUpperCase();

        if (rawCoupon) {
          const [couponRows] = await conn.query(
            `SELECT id, code, discount_type, discount_value, min_order_amount,
                    max_discount_amount, usage_limit, times_used, expires_at, is_active
             FROM coupons WHERE code = ?`,
            [rawCoupon]
          );

          if (couponRows.length > 0) {
            const c = couponRows[0];
            const now = new Date();
            const isExpired = c.expires_at && new Date(c.expires_at) < now;
            const limitReached = c.usage_limit !== null && c.times_used >= c.usage_limit;

            if (c.is_active && !isExpired && !limitReached) {
              if (calculatedSubtotal >= Number(c.min_order_amount || 0)) {
                couponId = c.id;
                if (c.discount_type === 'percentage') {
                  discountAmount = (calculatedSubtotal * Number(c.discount_value)) / 100;
                  if (c.max_discount_amount) {
                    discountAmount = Math.min(discountAmount, Number(c.max_discount_amount));
                  }
                } else {
                  discountAmount = Number(c.discount_value);
                }
                discountAmount = Math.min(discountAmount, calculatedSubtotal);
                discountAmount = Math.round(discountAmount * 100) / 100;

                await conn.query(
                  'UPDATE coupons SET times_used = times_used + 1 WHERE id = ?',
                  [c.id]
                );
              }
            }
          }
        }

        // Validate Affiliate Referral Code
        let affiliateId = null;
        let affiliateCommission = 0.0;
        const rawReferral = (referral_code || referralCode || affiliate_code || '').trim().toUpperCase();

        if (rawReferral) {
          const [affRows] = await conn.query(
            'SELECT id, referral_code, commission_rate, is_active FROM affiliates WHERE referral_code = ?',
            [rawReferral]
          );

          if (affRows.length > 0 && affRows[0].is_active) {
            const aff = affRows[0];
            affiliateId = aff.id;
            const commRate = Number(aff.commission_rate || 5.0);
            affiliateCommission = Math.round(((calculatedSubtotal * commRate) / 100) * 100) / 100;
          }
        }

        const totalAmount = Math.max(0, calculatedSubtotal + shippingFee - discountAmount);
        const orderNumber = generateOrderNumber();
        const userId = req.user ? req.user.id : null;

        // Order status
        const orderStatus = normalizedPayment === 'COD' ? 'CONFIRMED' : 'PENDING';
        const paymentStatus = 'PENDING';

        const [orderInsert] = await conn.query(
          `INSERT INTO orders (
            order_number, user_id, customer_name, customer_email, customer_phone,
            delivery_address, delivery_city, delivery_zone_id, shipping_fee,
            subtotal, discount_amount, total_amount, payment_method, payment_status,
            order_status, coupon_id, affiliate_id, notes, ip_address, user_agent
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderNumber,
            userId,
            customer_name.trim(),
            customer_email ? customer_email.trim() : null,
            customer_phone.trim(),
            delivery_address.trim(),
            delivery_city ? delivery_city.trim() : 'Dhaka',
            resolvedZoneId,
            shippingFee,
            calculatedSubtotal,
            discountAmount,
            totalAmount,
            normalizedPayment,
            paymentStatus,
            orderStatus,
            couponId,
            affiliateId,
            notes ? notes.trim() : null,
            req.ip || '127.0.0.1',
            req.headers['user-agent'] || '',
          ]
        );

        const orderId = orderInsert.insertId;

        // Record affiliate referral reward
        if (affiliateId && affiliateCommission > 0) {
          await conn.query(
            `INSERT INTO affiliate_referrals (affiliate_id, order_id, order_total, commission_amount, status)
             VALUES (?, ?, ?, ?, 'approved')`,
            [affiliateId, orderId, calculatedSubtotal, affiliateCommission]
          );

          await conn.query(
            `UPDATE affiliates
             SET balance = balance + ?, total_earned = total_earned + ?
             WHERE id = ?`,
            [affiliateCommission, affiliateCommission, affiliateId]
          );
        }

        // Insert Order Items
        for (const item of verifiedItems) {
          await conn.query(
            `INSERT INTO order_items (
              order_id, product_id, variant_id, product_name, variant_name,
              sku, unit_price, quantity, total_price
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              orderId,
              item.productId,
              item.variantId,
              item.productName,
              item.variantName,
              item.sku,
              item.unitPrice,
              item.quantity,
              item.totalPrice,
            ]
          );
        }

        return {
          id: orderId,
          orderNumber,
          customerName: customer_name,
          customerPhone: customer_phone,
          customerEmail: customer_email,
          deliveryAddress: delivery_address,
          deliveryCity: delivery_city || 'Dhaka',
          subtotal: calculatedSubtotal,
          shippingFee,
          discountAmount,
          totalAmount,
          couponId,
          affiliateId,
          paymentMethod: normalizedPayment,
          paymentStatus,
          orderStatus,
          items: verifiedItems,
        };
      });

      // 4. Handle SSLCommerz Gateway Redirection
      if (orderResult.paymentMethod === 'SSLCOMMERZ') {
        const paymentInit = await sslcommerzService.initiatePayment({
          orderNumber: orderResult.orderNumber,
          totalAmount: orderResult.totalAmount,
          customerName: orderResult.customerName,
          customerEmail: orderResult.customerEmail,
          customerPhone: orderResult.customerPhone,
          deliveryAddress: orderResult.deliveryAddress,
          deliveryCity: orderResult.deliveryCity,
        });

        return res.status(201).json({
          success: true,
          message: 'Order created successfully. Redirecting to payment gateway.',
          data: {
            order: orderResult,
            gatewayUrl: paymentInit.gatewayUrl,
            sessionKey: paymentInit.sessionKey,
          },
        });
      }

      // COD Response
      return res.status(201).json({
        success: true,
        message: 'Order placed successfully with Cash on Delivery.',
        data: {
          order: orderResult,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get single order by order_number
   * GET /api/v1/orders/:orderNumber
   */
  async getOrderByNumber(req, res, next) {
    try {
      const { orderNumber } = req.params;

      const orders = await query(
        `SELECT o.*, sz.name AS zone_name
         FROM orders o
         LEFT JOIN shipping_zones sz ON o.delivery_zone_id = sz.id
         WHERE o.order_number = ?`,
        [orderNumber]
      );

      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          error: `Order "${orderNumber}" not found`,
        });
      }

      const order = orders[0];

      const items = await query(
        `SELECT oi.*, p.slug AS product_slug,
                (SELECT image_url FROM product_images WHERE product_id = oi.product_id AND is_primary = TRUE LIMIT 1) AS image_url
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );

      res.json({
        success: true,
        data: {
          ...order,
          items,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get user order history (Authenticated)
   * GET /api/v1/orders
   */
  async getUserOrders(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const orders = await query(
        `SELECT id, order_number, total_amount, payment_method, payment_status,
                order_status, created_at
         FROM orders
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
      );

      res.json({ success: true, data: orders });
    } catch (err) {
      next(err);
    }
  },
};
