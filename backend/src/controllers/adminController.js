import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, transaction, execute } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const adminController = {
  /**
   * Get operational statistics and dashboard telemetry
   * GET /api/v1/admin/stats
   */
  async getDashboardStats(req, res, next) {
    try {
      // 1. Order counts and revenue totals
      const [orderMetrics] = await query(`
        SELECT 
          COUNT(*) AS total_orders,
          COALESCE(SUM(CASE WHEN payment_status = 'PAID' OR order_status = 'DELIVERED' THEN total_amount ELSE 0 END), 0) AS total_revenue,
          COUNT(CASE WHEN order_status = 'PENDING' OR order_status = 'CONFIRMED' THEN 1 END) AS pending_orders,
          COUNT(CASE WHEN order_status = 'PROCESSING' THEN 1 END) AS processing_orders,
          COUNT(CASE WHEN order_status = 'SHIPPED' THEN 1 END) AS shipped_orders,
          COUNT(CASE WHEN order_status = 'DELIVERED' THEN 1 END) AS delivered_orders,
          COUNT(CASE WHEN order_status = 'CANCELLED' THEN 1 END) AS cancelled_orders
        FROM orders
      `);

      // 2. Product and catalog counts
      const [productMetrics] = await query(`
        SELECT 
          COUNT(*) AS total_products,
          COUNT(CASE WHEN is_active = TRUE THEN 1 END) AS active_products,
          COUNT(CASE WHEN is_featured = TRUE THEN 1 END) AS featured_products
        FROM products
      `);

      // 3. Low stock alert items (variants with stock <= 5)
      const lowStockVariants = await query(`
        SELECT 
          pv.id AS variant_id,
          pv.sku,
          pv.variant_name,
          pv.stock_quantity,
          p.id AS product_id,
          p.name AS product_name,
          c.name AS category_name
        FROM product_variants pv
        JOIN products p ON pv.product_id = p.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE pv.is_active = TRUE AND pv.stock_quantity <= 5
        ORDER BY pv.stock_quantity ASC
        LIMIT 10
      `);

      // 4. Recent 6 orders
      const recentOrders = await query(`
        SELECT 
          id, order_number, customer_name, customer_phone,
          total_amount, payment_method, payment_status, order_status, created_at
        FROM orders
        ORDER BY created_at DESC
        LIMIT 6
      `);

      // 5. Total customer users count
      const [userMetrics] = await query(`
        SELECT COUNT(*) AS total_users FROM users WHERE role = 'customer'
      `);

      res.json({
        success: true,
        data: {
          orders: {
            total: Number(orderMetrics.total_orders || 0),
            revenue: Number(orderMetrics.total_revenue || 0),
            pending: Number(orderMetrics.pending_orders || 0),
            processing: Number(orderMetrics.processing_orders || 0),
            shipped: Number(orderMetrics.shipped_orders || 0),
            delivered: Number(orderMetrics.delivered_orders || 0),
            cancelled: Number(orderMetrics.cancelled_orders || 0),
          },
          products: {
            total: Number(productMetrics.total_products || 0),
            active: Number(productMetrics.active_products || 0),
            featured: Number(productMetrics.featured_products || 0),
          },
          customers: {
            total: Number(userMetrics.total_users || 0),
          },
          lowStock: lowStockVariants,
          recentOrders,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * List all orders with filters, search, and pagination
   * GET /api/v1/admin/orders
   */
  async getOrders(req, res, next) {
    try {
      const {
        status,
        payment_status,
        search,
        page = 1,
        limit = 15,
      } = req.query;

      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 15));
      const offset = (pageNum - 1) * limitNum;

      const conditions = [];
      const params = [];

      if (status) {
        conditions.push('order_status = ?');
        params.push(status);
      }

      if (payment_status) {
        conditions.push('payment_status = ?');
        params.push(payment_status);
      }

      if (search && search.trim()) {
        const term = `%${search.trim()}%`;
        conditions.push('(order_number LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)');
        params.push(term, term, term);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const [countResult] = await query(
        `SELECT COUNT(*) AS total FROM orders ${whereClause}`,
        params
      );
      const total = Number(countResult.total || 0);

      const orders = await query(
        `SELECT 
          o.id, o.order_number, o.customer_name, o.customer_phone, o.customer_email,
          o.delivery_city, o.delivery_address, o.subtotal, o.shipping_fee, o.total_amount,
          o.payment_method, o.payment_status, o.order_status, o.created_at,
          (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS item_count
        FROM orders o
        ${whereClause}
        ORDER BY o.created_at DESC
        LIMIT ? OFFSET ?`,
        [...params, limitNum, offset]
      );

      res.json({
        success: true,
        data: orders,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get single order details with all items
   * GET /api/v1/admin/orders/:id
   */
  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;

      const orders = await query(
        `SELECT o.*, sz.name AS zone_name
         FROM orders o
         LEFT JOIN shipping_zones sz ON o.delivery_zone_id = sz.id
         WHERE o.id = ? OR o.order_number = ?`,
        [id, id]
      );

      if (orders.length === 0) {
        return res.status(404).json({ success: false, error: 'Order not found' });
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
   * Update order status and fulfillment details
   * PATCH /api/v1/admin/orders/:id/status
   */
  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { order_status, payment_status, notes } = req.body;

      const allowedOrderStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
      const allowedPaymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

      if (order_status && !allowedOrderStatuses.includes(order_status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid order status. Allowed: ${allowedOrderStatuses.join(', ')}`,
        });
      }

      if (payment_status && !allowedPaymentStatuses.includes(payment_status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid payment status. Allowed: ${allowedPaymentStatuses.join(', ')}`,
        });
      }

      await transaction(async (conn) => {
        const [orders] = await conn.query(
          'SELECT id, order_status, payment_status FROM orders WHERE id = ? FOR UPDATE',
          [id]
        );

        if (orders.length === 0) {
          const err = new Error('Order not found');
          err.statusCode = 404;
          throw err;
        }

        const currentOrder = orders[0];

        // If transitioning to CANCELLED from a non-cancelled status, restore stock
        if (order_status === 'CANCELLED' && currentOrder.order_status !== 'CANCELLED') {
          const [items] = await conn.query(
            'SELECT variant_id, quantity FROM order_items WHERE order_id = ?',
            [id]
          );

          for (const item of items) {
            if (item.variant_id) {
              await conn.query(
                'UPDATE product_variants SET stock_quantity = stock_quantity + ? WHERE id = ?',
                [item.quantity, item.variant_id]
              );
              await conn.query(
                `INSERT INTO inventory_logs (variant_id, change_amount, reason)
                 VALUES (?, ?, ?)`,
                [item.variant_id, item.quantity, `ORDER_CANCELLED_RESTORE_${id}`]
              );
            }
          }
        }

        const updates = [];
        const params = [];

        if (order_status) {
          updates.push('order_status = ?');
          params.push(order_status);
        }

        if (payment_status) {
          updates.push('payment_status = ?');
          params.push(payment_status);
        }

        if (notes !== undefined) {
          updates.push('notes = ?');
          params.push(notes);
        }

        if (updates.length > 0) {
          params.push(id);
          await conn.query(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, params);
        }
      });

      res.json({
        success: true,
        message: 'Order updated successfully.',
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * List all products for administration
   * GET /api/v1/admin/products
   */
  async getProducts(req, res, next) {
    try {
      const { search, category_id, is_active } = req.query;

      const conditions = [];
      const params = [];

      if (category_id) {
        conditions.push('p.category_id = ?');
        params.push(category_id);
      }

      if (is_active !== undefined) {
        conditions.push('p.is_active = ?');
        params.push(is_active === 'true' || is_active === '1');
      }

      if (search && search.trim()) {
        const term = `%${search.trim()}%`;
        conditions.push('(p.name LIKE ? OR p.sku LIKE ?)');
        params.push(term, term);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const products = await query(
        `SELECT 
          p.id, p.name, p.slug, p.sku, p.short_description,
          p.regular_price, p.sale_price, p.is_featured, p.is_active, p.created_at,
          p.model_3d_url, p.model_3d_format,
          c.id AS category_id, c.name AS category_name,
          (
            SELECT image_url 
            FROM product_images pi 
            WHERE pi.product_id = p.id 
            ORDER BY pi.is_primary DESC, pi.sort_order ASC 
            LIMIT 1
          ) AS primary_image,
          COALESCE(
            (SELECT SUM(stock_quantity) FROM product_variants WHERE product_id = p.id AND is_active = TRUE),
            0
          ) AS total_stock,
          (
            SELECT COUNT(*) FROM product_variants WHERE product_id = p.id
          ) AS variant_count
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        ${whereClause}
        ORDER BY p.id DESC`,
        params
      );

      res.json({
        success: true,
        data: products,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Create a new product with primary variant
   * POST /api/v1/admin/products
   */
  async createProduct(req, res, next) {
    try {
      const {
        name,
        slug,
        sku,
        category_id,
        short_description,
        description,
        regular_price,
        sale_price,
        is_featured = false,
        is_active = true,
        stock_quantity = 10,
        image_url,
        model_3d_url = null,
        model_3d_format = null,
      } = req.body;

      if (!name || !sku || !regular_price || !category_id) {
        return res.status(400).json({
          success: false,
          error: 'Name, SKU, Category, and Regular Price are required.',
        });
      }

      let generatedSlug = (slug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      // Check for slug uniqueness
      const existingSlug = await query('SELECT id FROM products WHERE slug = ?', [generatedSlug]);
      if (existingSlug.length > 0) {
        generatedSlug = `${generatedSlug}-${Date.now().toString().slice(-5)}`;
      }

      const result = await transaction(async (conn) => {
        // Insert product
        const [prodInsert] = await conn.query(
          `INSERT INTO products (
            name, slug, sku, category_id, short_description, description,
            regular_price, sale_price, is_featured, is_active,
            model_3d_url, model_3d_format
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            name.trim(),
            generatedSlug,
            sku.trim().toUpperCase(),
            category_id,
            short_description || null,
            description || null,
            parseFloat(regular_price),
            sale_price ? parseFloat(sale_price) : null,
            is_featured ? 1 : 0,
            is_active ? 1 : 0,
            model_3d_url || null,
            model_3d_format || null,
          ]
        );

        const productId = prodInsert.insertId;

        // Insert primary image if provided
        if (image_url) {
          await conn.query(
            `INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
             VALUES (?, ?, ?, TRUE, 0)`,
            [productId, image_url, name]
          );
        }

        // Insert default base variant
        const initialStock = parseInt(stock_quantity, 10) || 10;
        const [varInsert] = await conn.query(
          `INSERT INTO product_variants (
            product_id, sku, variant_name, attribute_name, attribute_value,
            price_adjustment, stock_quantity, is_active
          ) VALUES (?, ?, ?, ?, ?, 0.0, ?, TRUE)`,
          [
            productId,
            `${sku.trim().toUpperCase()}-STD`,
            'Standard Edition',
            'Edition',
            'Standard',
            initialStock,
          ]
        );

        await conn.query(
          `INSERT INTO inventory_logs (variant_id, change_amount, reason)
           VALUES (?, ?, 'INITIAL_STOCK')`,
          [varInsert.insertId, initialStock]
        );

        return { productId, slug: generatedSlug };
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update stock quantity for a product's primary variant
   * PATCH /api/v1/admin/products/:id/stock
   */
  async updateProductStock(req, res, next) {
    try {
      const { id } = req.params;
      const { stock_quantity } = req.body;

      if (stock_quantity === undefined || isNaN(Number(stock_quantity))) {
        return res.status(400).json({ success: false, error: 'Valid stock quantity is required.' });
      }

      const qty = parseInt(stock_quantity, 10);

      await transaction(async (conn) => {
        const [variants] = await conn.query(
          'SELECT id, stock_quantity FROM product_variants WHERE product_id = ? ORDER BY id ASC LIMIT 1 FOR UPDATE',
          [id]
        );

        if (variants.length === 0) {
          const err = new Error('Product variant not found.');
          err.statusCode = 404;
          throw err;
        }

        const v = variants[0];
        const diff = qty - v.stock_quantity;

        await conn.query(
          'UPDATE product_variants SET stock_quantity = ? WHERE id = ?',
          [qty, v.id]
        );

        await conn.query(
          `INSERT INTO inventory_logs (variant_id, change_amount, reason)
           VALUES (?, ?, 'ADMIN_MANUAL_ADJUSTMENT')`,
          [v.id, diff]
        );
      });

      res.json({
        success: true,
        message: 'Stock updated successfully.',
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Toggle product active status
   * PATCH /api/v1/admin/products/:id/toggle-active
   */
  async toggleProductStatus(req, res, next) {
    try {
      const { id } = req.params;

      await execute(
        'UPDATE products SET is_active = NOT is_active WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Product active status toggled.',
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update product details, pricing, categories, and 3D Model configuration
   * PATCH /api/v1/admin/products/:id
   */
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        sku,
        category_id,
        short_description,
        description,
        regular_price,
        sale_price,
        is_featured,
        is_active,
        image_url,
        model_3d_url,
        model_3d_format,
        stock_quantity,
      } = req.body;

      const existing = await query('SELECT id FROM products WHERE id = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      const updates = [];
      const values = [];

      if (name !== undefined) { updates.push('name = ?'); values.push(name.trim()); }
      if (sku !== undefined) { updates.push('sku = ?'); values.push(sku.trim().toUpperCase()); }
      if (category_id !== undefined) { updates.push('category_id = ?'); values.push(category_id); }
      if (short_description !== undefined) { updates.push('short_description = ?'); values.push(short_description); }
      if (description !== undefined) { updates.push('description = ?'); values.push(description); }
      if (regular_price !== undefined) { updates.push('regular_price = ?'); values.push(parseFloat(regular_price)); }
      if (sale_price !== undefined) { updates.push('sale_price = ?'); values.push(sale_price ? parseFloat(sale_price) : null); }
      if (is_featured !== undefined) { updates.push('is_featured = ?'); values.push(Boolean(is_featured)); }
      if (is_active !== undefined) { updates.push('is_active = ?'); values.push(Boolean(is_active)); }
      if (model_3d_url !== undefined) { updates.push('model_3d_url = ?'); values.push(model_3d_url || null); }
      if (model_3d_format !== undefined) { updates.push('model_3d_format = ?'); values.push(model_3d_format || null); }

      if (updates.length > 0) {
        values.push(id);
        await query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values);
      }

      // If image_url was provided, update or insert primary image
      if (image_url) {
        const existingImg = await query('SELECT id FROM product_images WHERE product_id = ? AND is_primary = TRUE', [id]);
        if (existingImg.length > 0) {
          await query('UPDATE product_images SET image_url = ? WHERE id = ?', [image_url, existingImg[0].id]);
        } else {
          await query('INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, TRUE)', [id, image_url]);
        }
      }

      // If stock_quantity was provided, update standard variant
      if (stock_quantity !== undefined) {
        const qty = parseInt(stock_quantity, 10);
        if (!isNaN(qty)) {
          await query('UPDATE product_variants SET stock_quantity = ? WHERE product_id = ? ORDER BY id ASC LIMIT 1', [qty, id]);
        }
      }

      res.json({
        success: true,
        message: 'Product updated successfully.',
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Upload custom 3D model file (.glb, .gltf, .stl, .obj)
   * POST /api/v1/admin/upload-3d
   */
  async upload3DModel(req, res, next) {
    try {
      const { fileName, fileData, format } = req.body;
      if (!fileData) {
        return res.status(400).json({ success: false, error: 'File data is required' });
      }

      // Ensure uploads/models directory exists
      const modelsDir = path.resolve(__dirname, '../../../uploads/models');
      await fs.promises.mkdir(modelsDir, { recursive: true });

      // Clean file name
      const safeName = (fileName || 'model.glb')
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .toLowerCase();
      const finalFileName = `${Date.now()}-${safeName}`;
      const filePath = path.join(modelsDir, finalFileName);

      // Extract base64 payload if data URI
      let buffer;
      if (fileData.includes(';base64,')) {
        const base64Data = fileData.split(';base64,')[1];
        buffer = Buffer.from(base64Data, 'base64');
      } else {
        buffer = Buffer.from(fileData, 'base64');
      }

      await fs.promises.writeFile(filePath, buffer);

      const ext = path.extname(safeName).replace('.', '').toLowerCase() || format || 'glb';
      const fileUrl = `/uploads/models/${finalFileName}`;

      res.json({
        success: true,
        fileUrl,
        format: ext,
        message: '3D model asset uploaded successfully',
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Admin: Export orders report to CSV format with Excel UTF-8 BOM
   * GET /api/v1/admin/orders/export
   */
  async exportOrders(req, res, next) {
    try {
      const { status, payment_status, search } = req.query;

      const conditions = [];
      const params = [];

      if (status) {
        conditions.push('o.order_status = ?');
        params.push(status);
      }

      if (payment_status) {
        conditions.push('o.payment_status = ?');
        params.push(payment_status);
      }

      if (search && search.trim()) {
        const term = `%${search.trim()}%`;
        conditions.push('(o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ?)');
        params.push(term, term, term);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const orders = await query(
        `SELECT 
          o.order_number, o.created_at, o.customer_name, o.customer_phone, o.customer_email,
          o.delivery_city, o.delivery_address, o.payment_method, o.payment_status, o.order_status,
          o.subtotal, o.shipping_fee, o.discount_amount, o.total_amount,
          c.code AS coupon_code, a.referral_code AS affiliate_code
        FROM orders o
        LEFT JOIN coupons c ON o.coupon_id = c.id
        LEFT JOIN affiliates a ON o.affiliate_id = a.id
        ${whereClause}
        ORDER BY o.created_at DESC`,
        params
      );

      const escapeCsv = (val) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const headers = [
        'Order Number',
        'Order Date',
        'Customer Name',
        'Phone',
        'Email',
        'City',
        'Delivery Address',
        'Payment Method',
        'Payment Status',
        'Order Status',
        'Subtotal (BDT)',
        'Shipping Fee (BDT)',
        'Discount (BDT)',
        'Total Amount (BDT)',
        'Coupon Code',
        'Affiliate Code',
      ];

      const rows = orders.map((o) => [
        escapeCsv(o.order_number),
        escapeCsv(new Date(o.created_at).toISOString()),
        escapeCsv(o.customer_name),
        escapeCsv(o.customer_phone),
        escapeCsv(o.customer_email || ''),
        escapeCsv(o.delivery_city),
        escapeCsv(o.delivery_address),
        escapeCsv(o.payment_method),
        escapeCsv(o.payment_status),
        escapeCsv(o.order_status),
        escapeCsv(o.subtotal),
        escapeCsv(o.shipping_fee),
        escapeCsv(o.discount_amount),
        escapeCsv(o.total_amount),
        escapeCsv(o.coupon_code || ''),
        escapeCsv(o.affiliate_code || ''),
      ].join(','));

      const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="lazyforge-orders-${new Date().toISOString().slice(0, 10)}.csv"`
      );
      res.status(200).send(csvContent);
    } catch (err) {
      next(err);
    }
  },
};

