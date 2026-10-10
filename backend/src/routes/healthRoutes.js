import { Router } from 'express';
import { ping } from '../config/database.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const dbConnected = await ping();
    res.json({
      success: true,
      service: 'LazyForge REST API',
      status: 'healthy',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      service: 'LazyForge REST API',
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message,
    });
  }
});

export default router;
