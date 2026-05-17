import { Request, Response } from 'express';
import { Interview } from '../models/Interview';
import { asyncHandler } from '../utils/asyncHandler';

export const vapiWebhook = asyncHandler(async (req: Request, res: Response) => {
  const event = req.body as {
    message?: {
      type: string;
      call?: { id: string };
      artifact?: {
        messages?: Array<{ role: string; message: string; time: number }>;
      };
    };
  };

  const msg = event.message;
  if (!msg) {
    res.json({ success: true });
    return;
  }

  if (msg.type === 'end-of-call-report') {
    const callId = msg.call?.id;
    const messages = msg.artifact?.messages ?? [];

    if (callId && messages.length > 0) {
      const transcript = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          text: m.message,
          ts: new Date(m.time),
        }));

      await Interview.findOneAndUpdate(
        { vapiCallId: callId },
        {
          $set: {
            transcript,
            status: 'completed',
            endedAt: new Date(),
          },
        }
      );
    }
  }

  if (msg.type === 'call-started') {
    const callId = msg.call?.id;
    if (callId) {
      await Interview.findOneAndUpdate(
        { vapiCallId: callId },
        { $set: { status: 'in_progress', startedAt: new Date() } }
      );
    }
  }

  res.json({ success: true });
});
