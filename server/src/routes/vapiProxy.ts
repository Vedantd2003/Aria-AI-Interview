import { Router, Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// The Vapi SDK automatically sends: Authorization: Bearer <VAPI_PUBLIC_KEY>
// Validate that token matches our known public key so random callers can't
// use our proxy to burn our Vapi credits.
function validateVapiPublicKey(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization ?? '';
  const expected = `Bearer ${env.VAPI_PUBLIC_KEY}`;
  if (auth !== expected) {
    res.status(401).json({ success: false, message: 'Unauthorized', code: 'UNAUTHORIZED' });
    return;
  }
  next();
}

// Proxy all Vapi API calls through our server using the PUBLIC key.
//
// Key insight: Vapi's /call/web always requires the PUBLIC key — the
// "allowed origins" check is a separate enforcement that only applies
// when the request has an Origin header (i.e. from a browser).
// Server-to-server requests have no Origin header, so Vapi skips the
// origin check, and the public key authenticates the request correctly.
//
//   browser  →  our server (CORS configured)
//   server   →  api.vapi.ai/call/web  Authorization: Bearer <PUBLIC_KEY>
//                                      (no Origin header → no origin check)
//   Daily.co WebRTC still goes browser → daily.co directly.
router.all(
  '*',
  validateVapiPublicKey,
  asyncHandler(async (req: Request, res: Response) => {
    const vapiUrl = `https://api.vapi.ai${req.path}`;
    const method = req.method.toUpperCase();
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);

    const vapiRes = await fetch(vapiUrl, {
      method,
      headers: {
        // Use PUBLIC key — /call/web requires it; origin check doesn't
        // apply server-side because there is no Origin request header.
        Authorization: `Bearer ${env.VAPI_PUBLIC_KEY}`,
        'Content-Type': 'application/json',
      },
      body: hasBody ? JSON.stringify(req.body) : undefined,
    });

    const text = await vapiRes.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    res.status(vapiRes.status).json(data);
  })
);

export default router;
