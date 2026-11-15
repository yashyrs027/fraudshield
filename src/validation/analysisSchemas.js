// src/validation/analysisSchemas.js
// ------------------------------------------------------------
// Zod validation schemas for the analysis endpoints
// ------------------------------------------------------------
const { z } = require('zod');

// Message analysis payload – text required, optional language (en or hi)
const validateMessage = (req, res, next) => {
  const schema = z.object({
    text: z.string().min(1, 'Message text is required'),
    language: z.enum(['en', 'hi']).optional(),
  });
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.errors[0].message });
  }
  req.body = result.data;
  next();
};

// QR analysis – expects multipart/form-data, Multer already ensures file exists; we just check mime type if needed.
const validateQR = (req, res, next) => {
  // Multer puts file info in req.file
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'QR image file is required' });
  }
  // Accept only image/png or image/jpeg
  const allowed = ['image/png', 'image/jpeg'];
  if (!allowed.includes(req.file.mimetype)) {
    return res.status(400).json({ success: false, error: 'Unsupported image type' });
  }
  next();
};

// URL analysis payload – simple URL validation
const validateURL = (req, res, next) => {
  const schema = z.object({
    url: z.string().url('Valid URL is required'),
  });
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.errors[0].message });
  }
  req.body = result.data;
  next();
};

// Unified analysis payload – allows any combination of the three sub‑payloads
const validateUnified = (req, res, next) => {
  const messageSchema = z.object({
    text: z.string().min(1),
    language: z.enum(['en', 'hi']).optional(),
  }).partial();

  const qrSchema = z.object({
    base64: z.string().nonempty(), // client should send base64 string of image
  }).partial();

  const urlSchema = z.object({
    url: z.string().url(),
  }).partial();

  const schema = z.object({
    message: messageSchema.optional(),
    qrImage: qrSchema.optional(),
    url: z.string().url().optional(),
  }).refine(data => data.message || data.qrImage || data.url, {
    message: 'At least one of message, qrImage, or url must be provided',
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.errors[0].message });
  }
  req.body = result.data;
  next();
};

module.exports = {
  validateMessage,
  validateQR,
  validateURL,
  validateUnified,
};
