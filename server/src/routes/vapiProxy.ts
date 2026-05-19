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

// Proxy all Vapi API calls through our server using the private key.
// This permanently bypasses Vapi's "allowed origins" restriction:
//   browser  →  our server (CORS already configured)
//   server   →  api.vapi.ai (server-to-server with private key, no origin check)
// Daily.co WebRTC audio still connects directly browser → daily.co.
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
        Authorization: `Bearer ${env.VAPI_PRIVATE_KEY}`,
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
