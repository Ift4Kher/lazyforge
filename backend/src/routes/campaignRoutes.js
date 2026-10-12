import { Router } from 'express';
import { landingPageController } from '../controllers/landingPageController.js';

const router = Router();

// Public campaign storefront lookup
router.get('/:slug', landingPageController.getPublicLandingPage);

export default router;
