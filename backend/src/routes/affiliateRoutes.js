import { Router } from 'express';
import {
  trackReferral,
  registerAffiliate,
  getAffiliateProfile,
  requestPayout,
  getAdminAffiliates,
  updateAdminAffiliate,
} from '../controllers/affiliateController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

// Public route to track / validate referral code
router.get('/track/:code', trackReferral);

// Authenticated customer routes
router.post('/register', authenticate, registerAffiliate);
router.get('/me', authenticate, getAffiliateProfile);
router.post('/payout', authenticate, requestPayout);

// Admin routes
router.get('/admin/all', authenticate, requireRole(['admin']), getAdminAffiliates);
router.patch('/admin/:id', authenticate, requireRole(['admin']), updateAdminAffiliate);

export default router;
