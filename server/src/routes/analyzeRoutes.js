import { Router } from 'express';
import { analysisController } from '../controllers/analysisController.js';
import { optionalAuth } from '../middlewares/authenticate.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';

const router = Router();

// Guest and authenticated users can access with appropriate rate limits
router.post(
  '/message',
  optionalAuth,
  rateLimiter({ windowMs: 60000, maxRequests: 20 }),
  uploadMiddleware.single('file'),
  analysisController.analyzeMessage
);

router.post(
  '/qr',
  optionalAuth,
  rateLimiter({ windowMs: 60000, maxRequests: 20 }),
  uploadMiddleware.single('file'),
  analysisController.analyzeQr
);

router.post(
  '/url',
  optionalAuth,
  rateLimiter({ windowMs: 60000, maxRequests: 20 }),
  analysisController.analyzeUrl
);

export default router;
