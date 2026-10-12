import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/shipping-zones', orderController.getShippingZones);
router.post('/', optionalAuth, orderController.createOrder);
router.get('/:orderNumber', orderController.getOrderByNumber);

// Authenticated user history
router.get('/', optionalAuth, orderController.getUserOrders);

export default router;
