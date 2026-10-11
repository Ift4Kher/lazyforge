import { Router } from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:slug', getProductBySlug);

export default router;
