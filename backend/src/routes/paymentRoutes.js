import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';

const router = Router();

// SSLCommerz Callbacks
router.post('/sslcommerz/success', paymentController.handleSuccess);
router.post('/sslcommerz/fail', paymentController.handleFail);
router.post('/sslcommerz/cancel', paymentController.handleCancel);
router.post('/sslcommerz/ipn', paymentController.handleIPN);

export default router;
