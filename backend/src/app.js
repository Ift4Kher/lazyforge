import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { helmetMiddleware, corsMiddleware, apiRateLimiter } from './middleware/security.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import apiV1Router from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Security Headers & Cross-Origin
app.use(helmetMiddleware);
app.use(corsMiddleware);

// Body Parsing & Cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.COOKIE.secret));

// Rate Limiting on API
app.use('/api', apiRateLimiter);

// Serve uploads directory statically (for hero video, posters, 3D assets, images)
const uploadsPath = path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/v1', apiV1Router);

// Fallback compatibility for /api -> /api/v1
app.use('/api', apiV1Router);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    service: 'LazyForge Technologies API Core',
    status: 'online',
    version: '1.0.0',
    documentation: '/docs',
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);
