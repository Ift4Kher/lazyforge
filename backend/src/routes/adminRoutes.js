import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { getAdminReviews, updateReviewStatus, deleteReview } from '../controllers/reviewController.js';
import { getAdminAffiliates, updateAdminAffiliate, exportAdminAffiliates } from '../controllers/affiliateController.js';
import { landingPageController } from '../controllers/landingPageController.js';
import { verifyAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

// Protect all admin routes with authentication and admin role check
router.use(verifyAuth);
router.use(requireRole(['admin', 'super_admin']));

// Telemetry & Stats
router.get('/stats', adminController.getDashboardStats);

// Orders Management & CSV Export
router.get('/orders/export', adminController.exportOrders);
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrderById);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// Products & Inventory Management & 3D Models
router.get('/products', adminController.getProducts);
router.post('/products', adminController.createProduct);
router.patch('/products/:id', adminController.updateProduct);
router.patch('/products/:id/stock', adminController.updateProductStock);
router.patch('/products/:id/toggle-active', adminController.toggleProductStatus);
router.post('/upload-3d', adminController.upload3DModel);

// Reviews Moderation
router.get('/reviews', getAdminReviews);
router.patch('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteReview);

// Affiliates Management & CSV Export
router.get('/affiliates/export', exportAdminAffiliates);
router.get('/affiliates', getAdminAffiliates);
router.patch('/affiliates/:id/status', updateAdminAffiliate);

// Landing Pages & Campaign Builder
router.get('/landing-pages', landingPageController.getAdminLandingPages);
router.get('/landing-pages/:slugOrId', landingPageController.getLandingPageBySlugOrId);
router.post('/landing-pages', landingPageController.saveLandingPage);
router.delete('/landing-pages/:id', landingPageController.deleteLandingPage);

export default router;
