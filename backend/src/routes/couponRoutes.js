import { Router } from 'express';
import { couponController } from '../controllers/couponController.js';
import { verifyAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

// Public route for storefront checkout discount application
router.post('/validate', couponController.validateCoupon);

// Admin coupon routes
router.get('/admin', verifyAuth, requireRole(['admin']), couponController.getAdminCoupons);
router.post('/admin', verifyAuth, requireRole(['admin']), couponController.createCoupon);

export default router;
