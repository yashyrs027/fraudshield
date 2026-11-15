import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/profile', authController.getProfile);
router.patch('/preferences', authController.updatePreferences);

export default router;
