import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signToken(payload) {
  return jwt.sign(payload, env.JWT.secret, {
    expiresIn: env.JWT.expiresIn,
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, env.JWT.secret);
  } catch (err) {
    return null;
  }
}
