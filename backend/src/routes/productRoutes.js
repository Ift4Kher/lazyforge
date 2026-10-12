import { Router } from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  get3DProducts,
} from '../controllers/productController.js';

import {
  getProductReviews,
  createReview,
} from '../controllers/reviewController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/3d-models', get3DProducts);
router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', optionalAuth, createReview);
router.get('/:slug', getProductBySlug);

export default router;
