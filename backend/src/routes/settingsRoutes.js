import { Router } from 'express';
import { getPublicSettings, updateHeroSettings } from '../controllers/settingsController.js';
import { verifyAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

router.get('/public', getPublicSettings);
router.put('/hero', verifyAuth, requireRole(['admin', 'marketing_manager']), updateHeroSettings);

export default router;
