import { Router } from 'express';
import {
  createInterview,
  listInterviews,
  getInterview,
  endInterview,
} from '../controllers/interview.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);
router.post('/', createInterview);
router.get('/', listInterviews);
router.get('/:id', getInterview);
router.post('/:id/end', endInterview);

export default router;
