import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredVars = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];

for (const key of requiredVars) {
  if (!process.env[key]) {
    console.warn(`[CONFIG WARNING] Missing environment variable: ${key}. Using fallback if available.`);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DB: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lazyforge_db',
    testDatabase: process.env.DB_TEST_NAME || 'lazyforge_test_db',
  },
  JWT: {
    secret: process.env.JWT_SECRET || 'lazyforge_dev_jwt_key_fallback_123',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  COOKIE: {
    secret: process.env.COOKIE_SECRET || 'lazyforge_cookie_secret_fallback',
  },
  CORS_ORIGIN: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  RATE_LIMIT: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '600', 10),
  },
  SSLCOMMERZ: {
    storeId: process.env.SSLCOMMERZ_STORE_ID || '',
    storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD || '',
    isSandbox: process.env.SSLCOMMERZ_IS_SANDBOX !== 'false',
    successUrl: process.env.SSLCOMMERZ_SUCCESS_URL || 'http://localhost:5000/api/v1/payments/sslcommerz/success',
    failUrl: process.env.SSLCOMMERZ_FAIL_URL || 'http://localhost:5000/api/v1/payments/sslcommerz/fail',
    cancelUrl: process.env.SSLCOMMERZ_CANCEL_URL || 'http://localhost:5000/api/v1/payments/sslcommerz/cancel',
    ipnUrl: process.env.SSLCOMMERZ_IPN_URL || 'http://localhost:5000/api/v1/payments/sslcommerz/ipn',
  },
  UPLOAD_DIR: process.env.UPLOAD_DIR || '../uploads',
};
