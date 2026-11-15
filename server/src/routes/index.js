// server/src/routes/index.js
import { Router } from 'express';
import authRoutes from './authRoutes.js';
import analyzeRoutes from './analyzeRoutes.js';
import assessmentRoutes from './assessmentRoutes.js';
import contactRoutes from './contactRoutes.js';
import incidentRoutes from './incidentRoutes.js';
import userRoutes from './userRoutes.js';
import preferencesRoutes from './preferencesRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/analyze', analyzeRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/contacts', contactRoutes);
router.use('/incidents', incidentRoutes);
router.use('/users', userRoutes);
router.use('/preferences', preferencesRoutes);

export default router;
