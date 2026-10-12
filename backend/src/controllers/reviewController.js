import { query } from '../config/database.js';
import { logger } from '../utils/logger.js';

/**
 * Public: Get reviews and rating summary for a product
 * GET /api/v1/products/:productId/reviews
 */
export async function getProductReviews(req, res) {
  try {
    const rawProductId = req.params.productId;

    // Resolve productId if passed as slug or id
    let productId = parseInt(rawProductId, 10);
    if (isNaN(productId)) {
      const prodRows = await query('SELECT id FROM products WHERE slug = ?', [rawProductId]);
      if (prodRows.length === 0) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      productId = prodRows[0].id;
    }

    const reviews = await query(
      `SELECT r.id, r.product_id, r.customer_name, r.rating, r.comment, r.is_verified_purchase, r.created_at
       FROM reviews r
       WHERE r.product_id = ? AND r.status = 'approved'
       ORDER BY r.created_at DESC`,
      [productId]
    );

    const totalReviews = reviews.length;
    let sumRating = 0;
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    for (const r of reviews) {
      sumRating += Number(r.rating);
      if (breakdown[r.rating] !== undefined) {
        breakdown[r.rating]++;
      }
    }

    const averageRating = totalReviews > 0 ? Number((sumRating / totalReviews).toFixed(1)) : 5.0;

    return res.json({
      success: true,
      summary: {
        totalReviews,
        averageRating,
        breakdown,
      },
      reviews: reviews.map((r) => ({
        id: r.id,
        productId: r.product_id,
        customerName: r.customer_name,
        rating: Number(r.rating),
        comment: r.comment,
        isVerifiedPurchase: Boolean(r.is_verified_purchase),
        createdAt: r.created_at,
      })),
    });
  } catch (err) {
    logger.error('Error fetching product reviews', { error: err.message });
    return res.status(500).json({ success: false, error: 'Failed to load reviews' });
  }
}

/**
 * Public/Customer: Submit a review for a product
 * POST /api/v1/products/:productId/reviews
 */
export async function createReview(req, res) {
  try {
    const rawProductId = req.params.productId;
    const { customerName, rating, comment } = req.body;

    let productId = parseInt(rawProductId, 10);
    if (isNaN(productId)) {
      const prodRows = await query('SELECT id FROM products WHERE slug = ?', [rawProductId]);
      if (prodRows.length === 0) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      productId = prodRows[0].id;
    }

    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be an integer between 1 and 5' });
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
      return res.status(400).json({ success: false, error: 'Review comment must be at least 5 characters long' });
    }

    let finalName = customerName && typeof customerName === 'string' ? customerName.trim() : '';
    let userId = null;
    let isVerifiedPurchase = false;

    // Check optional authenticated user
    if (req.user) {
      userId = req.user.id;
      if (!finalName) {
        finalName = req.user.name || 'Anonymous Maker';
      }

      // Check if user has an order for this product
      const orderMatch = await query(
        `SELECT o.id
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         WHERE o.user_id = ? AND oi.product_id = ?
         LIMIT 1`,
        [userId, productId]
      );

      if (orderMatch.length > 0) {
        isVerifiedPurchase = true;
      }
    }

    if (!finalName) {
      finalName = 'Verified Robotics Enthusiast';
    }

    const insertResult = await query(
      `INSERT INTO reviews (product_id, user_id, customer_name, rating, comment, is_verified_purchase, status)
       VALUES (?, ?, ?, ?, ?, ?, 'approved')`,
      [productId, userId, finalName, parsedRating, comment.trim(), isVerifiedPurchase]
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted successfully.',
      review: {
        id: insertResult.insertId,
        productId,
        customerName: finalName,
        rating: parsedRating,
        comment: comment.trim(),
        isVerifiedPurchase,
        status: 'approved',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    logger.error('Error submitting review', { error: err.message });
    return res.status(500).json({ success: false, error: 'Failed to submit review' });
  }
}

/**
 * Admin: Get all reviews across the catalog
 * GET /api/v1/admin/reviews
 */
export async function getAdminReviews(req, res) {
  try {
    const { status, productId } = req.query;
    let sql = `
      SELECT r.id, r.product_id, r.user_id, r.customer_name, r.rating, r.comment,
             r.is_verified_purchase, r.status, r.created_at,
             p.name as product_name, p.slug as product_slug
      FROM reviews r
      JOIN products p ON r.product_id = p.id
    `;
    const params = [];
    const conditions = [];

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      conditions.push('r.status = ?');
      params.push(status);
    }

    if (productId) {
      conditions.push('r.product_id = ?');
      params.push(parseInt(productId, 10));
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY r.created_at DESC LIMIT 100';

    const rows = await query(sql, params);

    return res.json({
      success: true,
      reviews: rows.map((r) => ({
        id: r.id,
        productId: r.product_id,
        productName: r.product_name,
        productSlug: r.product_slug,
        customerName: r.customer_name,
        rating: Number(r.rating),
        comment: r.comment,
        isVerifiedPurchase: Boolean(r.is_verified_purchase),
        status: r.status,
        createdAt: r.created_at,
      })),
    });
  } catch (err) {
    logger.error('Error getting admin reviews', { error: err.message });
    return res.status(500).json({ success: false, error: 'Failed to load reviews directory' });
  }
}

/**
 * Admin: Update review moderation status
 * PATCH /api/v1/admin/reviews/:id/status
 */
export async function updateReviewStatus(req, res) {
  try {
    const reviewId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be "pending", "approved", or "rejected"',
      });
    }

    const check = await query('SELECT id FROM reviews WHERE id = ?', [reviewId]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    await query('UPDATE reviews SET status = ? WHERE id = ?', [status, reviewId]);

    return res.json({
      success: true,
      message: `Review marked as ${status}`,
    });
  } catch (err) {
    logger.error('Error updating review status', { error: err.message });
    return res.status(500).json({ success: false, error: 'Failed to update review status' });
  }
}

/**
 * Admin: Delete a review permanently
 * DELETE /api/v1/admin/reviews/:id
 */
export async function deleteReview(req, res) {
  try {
    const reviewId = parseInt(req.params.id, 10);

    const check = await query('SELECT id FROM reviews WHERE id = ?', [reviewId]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    await query('DELETE FROM reviews WHERE id = ?', [reviewId]);

    return res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (err) {
    logger.error('Error deleting review', { error: err.message });
    return res.status(500).json({ success: false, error: 'Failed to delete review' });
  }
}
