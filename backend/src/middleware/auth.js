import { verifyToken } from '../utils/jwt.js';
import { query } from '../config/database.js';

export async function verifyAuth(req, res, next) {
  try {
    let token = req.cookies?.lazyforge_token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in to proceed.',
      });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session. Please log in again.',
      });
    }

    const users = await query(
      'SELECT id, name, email, phone, role, status FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || users[0].status !== 'active') {
      return res.status(401).json({
        success: false,
        error: 'Account not found or suspended.',
      });
    }

    req.user = users[0];
    next();
  } catch (err) {
    next(err);
  }
}

export async function optionalAuth(req, res, next) {
  try {
    let token = req.cookies?.lazyforge_token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded?.userId) {
        const users = await query(
          'SELECT id, name, email, phone, role, status FROM users WHERE id = ?',
          [decoded.userId]
        );
        if (users.length > 0 && users[0].status === 'active') {
          req.user = users[0];
        }
      }
    }
    next();
  } catch (err) {
    next();
  }
}

export const authenticate = verifyAuth;

