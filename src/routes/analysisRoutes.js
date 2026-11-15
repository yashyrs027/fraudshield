// src/routes/analysisRoutes.js
// ------------------------------------------------------------
// Router for FraudShield analysis endpoints
// ------------------------------------------------------------
// All routes are protected by JWT auth middleware where appropriate.
// The image upload for QR analysis uses Multer memory storage.

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB limit

const { messageAnalysis, qrAnalysis, urlAnalysis, unifiedAnalysis } = require('../controllers/analysisController');
const { validateMessage, validateQR, validateURL, validateUnified } = require('../validation/analysisSchemas');
const { optionalJwtAuth } = require('../middleware/authMiddleware'); // optional for public analyses

// Public endpoints (no auth) for quick checks – optionalJwtAuth will attach user if token present
router.post('/message', optionalJwtAuth, validateMessage, messageAnalysis);
router.post('/qr', optionalJwtAuth, upload.single('image'), validateQR, qrAnalysis);
router.post('/url', optionalJwtAuth, validateURL, urlAnalysis);
router.post('/unified', optionalJwtAuth, validateUnified, unifiedAnalysis);

module.exports = router;
