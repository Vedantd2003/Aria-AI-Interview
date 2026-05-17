import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';

export interface AccessTokenPayload {
  userId: string;
  email: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateTokenId(): string {
  return crypto.randomBytes(16).toString('hex');
}
