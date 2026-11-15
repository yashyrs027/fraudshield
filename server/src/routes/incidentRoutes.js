import { Router } from 'express';
import { incidentController } from '../controllers/incidentController.js';
import { optionalAuth } from '../middlewares/authenticate.js';

const router = Router();

router.post('/report', optionalAuth, incidentController.reportIncident);
router.get('/guidance/bank-hotlines', incidentController.getBankHotlines);

export default router;
