import { Router } from 'express';
import multer from 'multer';
import { updateMe, uploadResume, deleteResume } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

router.use(requireAuth);
router.patch('/me', updateMe);
router.post('/me/resume', upload.single('resume'), uploadResume);
router.delete('/me/resume', deleteResume);

export default router;
