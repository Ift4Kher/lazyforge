import { Router } from 'express';
import {
  getProductReviews,
  createReview,
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
} from '../controllers/reviewController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

// Public: Product review routes
router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', optionalAuth, createReview);

// Admin: Review moderation routes
router.get('/admin/all', authenticate, requireRole(['admin']), getAdminReviews);
router.patch('/admin/:id/status', authenticate, requireRole(['admin']), updateReviewStatus);
router.delete('/admin/:id', authenticate, requireRole(['admin']), deleteReview);

export default router;
