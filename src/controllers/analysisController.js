// src/controllers/analysisController.js
// ------------------------------------------------------------
// Analysis Controllers for FraudShield backend
// ------------------------------------------------------------
// Implements the four main analysis endpoints:
//   POST /api/v1/analysis/message
//   POST /api/v1/analysis/qr
//   POST /api/v1/analysis/url
//   POST /api/v1/analysis/unified
// Each controller validates input, calls the FastAPI AI service via
//   services/aiServiceClient.js, falls back to the deterministic rule engine
//   (services/fallbackRuleEngine.js) if the AI service is unavailable, and
//   returns a unified response format.
// ------------------------------------------------------------

const { analyzeMessage, analyzeQR, analyzeURL } = require("../services/aiServiceClient");
const fallbackEngine = require("../services/fallbackRuleEngine");
const logger = require("../utils/logger");

// Helper to build a unified response structure
function buildResponse(success, data, errorMessage = null) {
  return {
    success,
    data: success ? data : null,
    error: success ? null : errorMessage,
  };
}

// -------------------------------------------------------------------
// POST /analysis/message
// -------------------------------------------------------------------
async function messageAnalysis(req, res) {
  const { text, language } = req.body; // language optional (en/hi)
  try {
    // Call AI micro‑service
    const aiResult = await analyzeMessage({ text, language });
    res.json(buildResponse(true, aiResult));
  } catch (err) {
    logger.error("AI message analysis failed", { err: err.message });
    // Deterministic fallback based on simple keyword rules
    const fallback = fallbackEngine.messageFallback({ text, language });
    res.json(buildResponse(true, fallback, "AI service unavailable – used fallback"));
  }
}

// -------------------------------------------------------------------
// POST /analysis/qr
// -------------------------------------------------------------------
async function qrAnalysis(req, res) {
  // Expect multipart/form-data with field "image" (Multer memory storage)
  const imageBuffer = req.file?.buffer;
  if (!imageBuffer) {
    return res.status(400).json(buildResponse(false, null, "QR image file missing"));
  }
  try {
    const aiResult = await analyzeQR({ imageBase64: imageBuffer.toString("base64") });
    res.json(buildResponse(true, aiResult));
  } catch (err) {
    logger.error("AI QR analysis failed", { err: err.message });
    const fallback = fallbackEngine.qrFallback({ imageBuffer });
    res.json(buildResponse(true, fallback, "AI service unavailable – used fallback"));
  }
}

// -------------------------------------------------------------------
// POST /analysis/url
// -------------------------------------------------------------------
async function urlAnalysis(req, res) {
  const { url } = req.body;
  try {
    const aiResult = await analyzeURL({ url });
    res.json(buildResponse(true, aiResult));
  } catch (err) {
    logger.error("AI URL analysis failed", { err: err.message });
    const fallback = fallbackEngine.urlFallback({ url });
    res.json(buildResponse(true, fallback, "AI service unavailable – used fallback"));
  }
}

// -------------------------------------------------------------------
// POST /analysis/unified
// -------------------------------------------------------------------
// Accepts a bundle containing any combination of message, qr, and url data.
// The AI service offers a unified endpoint, but we also support a manual
// aggregation when it is unreachable.
async function unifiedAnalysis(req, res) {
  const { message, qrImage, url } = req.body; // message.text, qrImage.base64, url string
  try {
    const aiResult = await require("../services/aiServiceClient").analyzeUnified({ message, qrImage, url });
    return res.json(buildResponse(true, aiResult));
  } catch (err) {
    logger.warn("Unified AI endpoint failed – aggregating individual fallbacks", { err: err.message });
    const parts = {};
    if (message) parts.message = fallbackEngine.messageFallback(message);
    if (qrImage) parts.qr = fallbackEngine.qrFallback({ imageBuffer: Buffer.from(qrImage, "base64") });
    if (url) parts.url = fallbackEngine.urlFallback({ url });
    const unified = { riskLevel: "UNKNOWN", components: parts };
    return res.json(buildResponse(true, unified, "AI service unavailable – used fallback aggregation"));
  }
}

module.exports = {
  messageAnalysis,
  qrAnalysis,
  urlAnalysis,
  unifiedAnalysis,
};
