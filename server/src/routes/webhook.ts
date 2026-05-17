import { Router } from 'express';
import { vapiWebhook } from '../controllers/webhook.controller';

const router = Router();
router.post('/vapi', vapiWebhook);

export default router;
