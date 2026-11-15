import { Router } from 'express';
import { analysisController } from '../controllers/analysisController.js';
import { optionalAuth } from '../middlewares/authenticate.js';

const router = Router();

router.get('/history', optionalAuth, analysisController.getHistory);
router.get('/:sessionId', optionalAuth, analysisController.getAssessmentById);

export default router;
