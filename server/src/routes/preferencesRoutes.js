// server/src/routes/preferencesRoutes.js
// ------------------------------------------------------------
// Routes for user preferences (GET /:userId, PATCH /:userId)
// ------------------------------------------------------------
import { Router } from 'express';
import { getPreferences, updatePreferences } from '../controllers/preferencesController.js';
// Correct path to the JWT middleware (singular folder name)
import { requireJwtAuth } from '../middlewares/authMiddleware.js';
import { validatePreferences } from '../validation/preferencesSchema.js';

const router = Router();

// All routes require authentication
router.use(requireJwtAuth);

// GET preferences for a user
router.get('/:userId', getPreferences);

// PATCH preferences – validates the body
router.patch('/:userId', validatePreferences, updatePreferences);

export default router;
