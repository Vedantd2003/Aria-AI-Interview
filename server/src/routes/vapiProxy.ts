import { Router, Request, Response } from 'express';
import { env } from '../config/env';
import { requireAuth } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Proxy Vapi API calls through our server using the private key.
// This permanently bypasses Vapi's "allowed origins" restriction:
//   browser  →  our server (CORS OK)  →  api.vapi.ai (server-to-server, no origin check)
// Daily.co WebRTC still connects directly browser → daily.co (no Vapi API involved).
router.all(
  '*',
  requireAuth,
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
