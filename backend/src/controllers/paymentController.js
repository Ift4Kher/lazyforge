import { query, transaction } from '../config/database.js';
import { sslcommerzService } from '../services/sslcommerzService.js';
import { env } from '../config/env.js';

export const paymentController = {
  /**
   * SSLCommerz Success Callback (POST from gateway)
   * POST /api/v1/payments/sslcommerz/success
   */
  async handleSuccess(req, res, next) {
    try {
      const { val_id, tran_id, amount, currency, bank_tran_id, card_type } = req.body;
      const orderNumber = tran_id;

      if (!orderNumber) {
        return res.status(400).send('Transaction ID (order_number) missing in callback.');
      }

      // 1. Verify with SSLCommerz validation API
      let validationResult;
      try {
        validationResult = await sslcommerzService.validatePayment(val_id);
      } catch (valErr) {
        console.error('[PAYMENT VALIDATION ERROR]:', valErr);
        return res.redirect(`/order-confirmation/${orderNumber}?status=validation_failed`);
      }

      // 2. Idempotent Transactional Order Update
      await transaction(async (conn) => {
        const [orders] = await conn.query(
          'SELECT id, payment_status, total_amount FROM orders WHERE order_number = ? FOR UPDATE',
          [orderNumber]
        );

        if (orders.length === 0) {
          throw new Error(`Order ${orderNumber} not found.`);
        }

        const order = orders[0];

        // If already paid, do not duplicate actions
        if (order.payment_status === 'PAID') {
          return;
        }

        // Update Order
        await conn.query(
          `UPDATE orders
           SET payment_status = 'PAID',
               order_status = 'PROCESSING',
               updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [order.id]
        );

        // Record Payment Transaction
        await conn.query(
          `INSERT INTO payment_transactions (
            order_id, gateway, transaction_id, validation_id, amount, currency, status, raw_response
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            order.id,
            'SSLCOMMERZ',
            bank_tran_id || val_id,
            val_id || '',
            amount || order.total_amount,
            currency || 'BDT',
            'SUCCESS',
            JSON.stringify(validationResult),
          ]
        );
      });

      // Redirect browser to storefront confirmation page
      const clientUrl = (env.CORS_ORIGIN[0] || 'http://localhost:3000').replace(/\/$/, '');
      return res.redirect(`${clientUrl}/order-confirmation/${orderNumber}?status=paid`);
    } catch (err) {
      console.error('[PAYMENT SUCCESS HANDLER ERROR]:', err);
      next(err);
    }
  },

  /**
   * SSLCommerz Fail Callback
   * POST /api/v1/payments/sslcommerz/fail
   */
  async handleFail(req, res, next) {
    try {
      const { tran_id, error } = req.body;
      const orderNumber = tran_id;

      if (orderNumber) {
        await transaction(async (conn) => {
          const [orders] = await conn.query(
            'SELECT id, payment_status FROM orders WHERE order_number = ? FOR UPDATE',
            [orderNumber]
          );

          if (orders.length > 0 && orders[0].payment_status !== 'PAID') {
            const orderId = orders[0].id;

            // Mark order failed
            await conn.query(
              `UPDATE orders
               SET payment_status = 'FAILED', order_status = 'CANCELLED'
               WHERE id = ?`,
              [orderId]
            );

            // Restore Stock
            const [items] = await conn.query(
              'SELECT variant_id, quantity FROM order_items WHERE order_id = ?',
              [orderId]
            );

            for (const item of items) {
              if (item.variant_id) {
                await conn.query(
                  'UPDATE product_variants SET stock_quantity = stock_quantity + ? WHERE id = ?',
                  [item.quantity, item.variant_id]
                );
                await conn.query(
                  `INSERT INTO inventory_logs (variant_id, change_amount, reason, order_id)
                   VALUES (?, ?, 'PAYMENT_FAILED_RESTOCK', ?)`,
                  [item.variant_id, item.quantity, orderId]
                );
              }
            }
          }
        });
      }

      const clientUrl = (env.CORS_ORIGIN[0] || 'http://localhost:3000').replace(/\/$/, '');
      return res.redirect(`${clientUrl}/order-confirmation/${orderNumber}?status=failed`);
    } catch (err) {
      next(err);
    }
  },

  /**
   * SSLCommerz Cancel Callback
   * POST /api/v1/payments/sslcommerz/cancel
   */
  async handleCancel(req, res, next) {
    try {
      const { tran_id } = req.body;
      const orderNumber = tran_id;

      if (orderNumber) {
        await transaction(async (conn) => {
          const [orders] = await conn.query(
            'SELECT id, payment_status FROM orders WHERE order_number = ? FOR UPDATE',
            [orderNumber]
          );

          if (orders.length > 0 && orders[0].payment_status !== 'PAID') {
            const orderId = orders[0].id;

            await conn.query(
              `UPDATE orders
               SET payment_status = 'CANCELLED', order_status = 'CANCELLED'
               WHERE id = ?`,
              [orderId]
            );

            // Restore Stock
            const [items] = await conn.query(
              'SELECT variant_id, quantity FROM order_items WHERE order_id = ?',
              [orderId]
            );

            for (const item of items) {
              if (item.variant_id) {
                await conn.query(
                  'UPDATE product_variants SET stock_quantity = stock_quantity + ? WHERE id = ?',
                  [item.quantity, item.variant_id]
                );
                await conn.query(
                  `INSERT INTO inventory_logs (variant_id, change_amount, reason, order_id)
                   VALUES (?, ?, 'PAYMENT_CANCELLED_RESTOCK', ?)`,
                  [item.variant_id, item.quantity, orderId]
                );
              }
            }
          }
        });
      }

      const clientUrl = (env.CORS_ORIGIN[0] || 'http://localhost:3000').replace(/\/$/, '');
      return res.redirect(`${clientUrl}/order-confirmation/${orderNumber}?status=cancelled`);
    } catch (err) {
      next(err);
    }
  },

  /**
   * SSLCommerz IPN (Instant Payment Notification) Webhook
   * POST /api/v1/payments/sslcommerz/ipn
   */
  async handleIPN(req, res, next) {
    try {
      const { val_id, tran_id, status } = req.body;

      if (!tran_id || !val_id) {
        return res.status(400).json({ success: false, error: 'Missing IPN parameters' });
      }

      if (status === 'VALID' || status === 'VALIDATED') {
        const validation = await sslcommerzService.validatePayment(val_id);
        if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
          await query(
            `UPDATE orders
             SET payment_status = 'PAID', order_status = 'PROCESSING'
             WHERE order_number = ? AND payment_status != 'PAID'`,
            [tran_id]
          );
        }
      }

      res.json({ success: true, message: 'IPN processed successfully' });
    } catch (err) {
      console.error('[IPN ERROR]:', err);
      res.status(500).json({ success: false, error: 'IPN processing error' });
    }
  },
};
