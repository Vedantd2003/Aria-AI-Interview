import { Router } from 'express';
import { createFeedback, getFeedback } from '../controllers/feedback.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);
router.post('/:interviewId', createFeedback);
router.get('/:interviewId', getFeedback);

export default router;
