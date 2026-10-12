import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import adminRoutes from './adminRoutes.js';
import couponRoutes from './couponRoutes.js';
import affiliateRoutes from './affiliateRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import campaignRoutes from './campaignRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/settings', settingsRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/coupons', couponRoutes);
router.use('/affiliates', affiliateRoutes);
router.use('/reviews', reviewRoutes);
router.use('/campaigns', campaignRoutes);

export default router;
