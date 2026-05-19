import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateTokenId,
} from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { env } from '../config/env';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60).trim(),
  // normalize email before any DB lookup so case never causes a false miss
  email: z.string().email('Invalid email address').transform((s) => s.toLowerCase().trim()),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Must contain at least one letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
});

const loginSchema = z.object({
  email: z.string().email().transform((s) => s.toLowerCase().trim()),
  password: z.string().min(1),
});

// In production the client and server are on different *.onrender.com subdomains,
// which are treated as cross-site. sameSite:'none' + secure:true is required for
// the refresh cookie to be sent on cross-origin requests.
const IS_PROD = env.NODE_ENV === 'production';
const COOKIE_OPTS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: (IS_PROD ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

function setRefreshCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, COOKIE_OPTS);
}

function clearRefreshCookie(res: Response) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? 'none' : 'lax',
    path: '/',
  });
}

async function issueTokens(
  res: Response,
  userId: string,
  email: string,
  userAgent: string
) {
  const tokenId = generateTokenId();
  const accessToken = signAccessToken({ userId, email });
  const refreshToken = signRefreshToken({ userId, tokenId });
  const hash = hashToken(refreshToken);

  await User.findByIdAndUpdate(userId, {
    $push: {
      refreshTokens: {
        $each: [{ hash, createdAt: new Date(), userAgent }],
        $slice: -5,
      },
    },
  });

  setRefreshCookie(res, refreshToken);
  return accessToken;
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = registerSchema.parse(req.body);

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'An account with this email already exists', 'EMAIL_TAKEN');

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });

  const accessToken = await issueTokens(
    res,
    user._id.toString(),
    user.email,
    req.headers['user-agent'] ?? ''
  );

  res.status(201).json({
    success: true,
    accessToken,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) throw ApiError.unauthorized('Invalid credentials');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw ApiError.unauthorized('Invalid credentials');

  const accessToken = await issueTokens(
    res,
    user._id.toString(),
    user.email,
    req.headers['user-agent'] ?? ''
  );

  res.json({
    success: true,
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) throw ApiError.unauthorized('No refresh token');

  let payload: ReturnType<typeof verifyRefreshToken>;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    clearRefreshCookie(res);
    throw ApiError.unauthorized('Invalid refresh token');
  }

  const hash = hashToken(token);
  const user = await User.findById(payload.userId);
  if (!user) throw ApiError.unauthorized('User not found');

  const tokenEntry = user.refreshTokens.find((t) => t.hash === hash);
  if (!tokenEntry) {
    // Token reuse detected — invalidate all sessions
    user.refreshTokens = [];
    await user.save();
    clearRefreshCookie(res);
    throw ApiError.unauthorized('Token reuse detected');
  }

  // Rotate: remove old token
  user.refreshTokens = user.refreshTokens.filter((t) => t.hash !== hash);
  await user.save();

  const accessToken = await issueTokens(
    res,
    user._id.toString(),
    user.email,
    req.headers['user-agent'] ?? ''
  );

  res.json({ success: true, accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;

  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      const hash = hashToken(token);
      await User.findByIdAndUpdate(payload.userId, {
        $pull: { refreshTokens: { hash } },
      });
    } catch {
      // ignore invalid token on logout
    }
  }

  clearRefreshCookie(res);
  res.json({ success: true, message: 'Logged out' });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.userId).select('-passwordHash -refreshTokens');
  if (!user) throw ApiError.unauthorized();

  res.json({ success: true, user });
});
