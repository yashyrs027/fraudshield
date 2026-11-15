// src/routes/index.js
// ------------------------------------------------------------
// Master router – aggregates all feature modules for the backend.
// ------------------------------------------------------------
const express = require('express');
const router = express.Router();

// Import feature routers
const analysisRouter = require('./analysisRoutes');
const authRouter = require('../controllers/authController'); // assuming authController exports a router
// TODO: import other routers (user, incident, etc.) when they are created.

// Mount feature routers under their base paths
router.use('/api/v1/analysis', analysisRouter);
// Assuming authController exports an Express router with /auth routes
if (authRouter && authRouter.router) {
  router.use('/api/v1/auth', authRouter.router);
}

module.exports = router;
