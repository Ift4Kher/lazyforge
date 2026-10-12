import { query, execute } from '../config/database.js';

export const couponController = {
  /**
   * Validate and calculate coupon discount
   * POST /api/v1/coupons/validate
   */
  async validateCoupon(req, res, next) {
    try {
      const { code, subtotal } = req.body;

      if (!code || typeof code !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Coupon code is required.',
        });
      }

      const orderSubtotal = parseFloat(subtotal) || 0;
      if (orderSubtotal <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Valid cart subtotal is required to apply discount.',
        });
      }

      const cleanCode = code.trim().toUpperCase();

      const couponRows = await query(
        `SELECT * FROM coupons WHERE code = ? AND is_active = TRUE LIMIT 1`,
        [cleanCode]
      );

      if (couponRows.length === 0) {
        return res.status(404).json({
          success: false,
          error: `Coupon "${cleanCode}" is invalid or does not exist.`,
        });
      }

      const coupon = couponRows[0];

      // Check expiration
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return res.status(400).json({
          success: false,
          error: `Coupon "${cleanCode}" has expired.`,
        });
      }

      // Check usage limits
      if (coupon.usage_limit !== null && coupon.times_used >= coupon.usage_limit) {
        return res.status(400).json({
          success: false,
          error: `Coupon "${cleanCode}" has reached its maximum usage limit.`,
        });
      }

      // Check minimum order amount
      const minAmount = parseFloat(coupon.min_order_amount) || 0;
      if (orderSubtotal < minAmount) {
        return res.status(400).json({
          success: false,
          error: `Minimum order amount for "${cleanCode}" is ৳${minAmount.toLocaleString()}. Current: ৳${orderSubtotal.toLocaleString()}`,
        });
      }

      // Calculate discount amount
      let discountAmount = 0;
      const discountVal = parseFloat(coupon.discount_value);

      if (coupon.discount_type === 'percentage') {
        discountAmount = (orderSubtotal * discountVal) / 100;
        if (coupon.max_discount_amount) {
          const maxCap = parseFloat(coupon.max_discount_amount);
          if (discountAmount > maxCap) {
            discountAmount = maxCap;
          }
        }
      } else {
        // Fixed amount discount
        discountAmount = Math.min(discountVal, orderSubtotal);
      }

      // Round discount to 2 decimal places
      discountAmount = Math.round(discountAmount * 100) / 100;
      const newSubtotal = Math.max(0, orderSubtotal - discountAmount);

      return res.json({
        success: true,
        data: {
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discount_type,
          discountValue: discountVal,
          discountAmount,
          originalSubtotal: orderSubtotal,
          discountedSubtotal: newSubtotal,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get all coupons (Admin)
   * GET /api/v1/coupons/admin
   */
  async getAdminCoupons(req, res, next) {
    try {
      const coupons = await query(
        'SELECT * FROM coupons ORDER BY created_at DESC'
      );
      res.json({ success: true, data: coupons });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Create coupon (Admin)
   * POST /api/v1/coupons/admin
   */
  async createCoupon(req, res, next) {
    try {
      const {
        code,
        discount_type = 'percentage',
        discount_value,
        min_order_amount = 0,
        max_discount_amount,
        usage_limit,
        expires_at,
      } = req.body;

      if (!code || !discount_value) {
        return res.status(400).json({
          success: false,
          error: 'Coupon code and discount value are required.',
        });
      }

      const cleanCode = code.trim().toUpperCase();

      await execute(
        `INSERT INTO coupons (
          code, discount_type, discount_value, min_order_amount,
          max_discount_amount, usage_limit, expires_at, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [
          cleanCode,
          discount_type,
          parseFloat(discount_value),
          parseFloat(min_order_amount) || 0,
          max_discount_amount ? parseFloat(max_discount_amount) : null,
          usage_limit ? parseInt(usage_limit, 10) : null,
          expires_at || null,
        ]
      );

      res.status(201).json({
        success: true,
        message: `Coupon "${cleanCode}" created successfully.`,
      });
    } catch (err) {
      next(err);
    }
  },
};
