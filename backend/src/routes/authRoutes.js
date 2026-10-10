import { Router } from 'express';
import { login, register, logout, getCurrentUser } from '../controllers/authController.js';
import { verifyAuth } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/security.js';

const router = Router();

router.post('/login', authRateLimiter, login);
router.post('/register', authRateLimiter, register);
router.post('/logout', logout);
router.get('/me', verifyAuth, getCurrentUser);

export default router;
