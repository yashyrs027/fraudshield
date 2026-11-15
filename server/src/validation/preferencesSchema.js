// server/src/validation/preferencesSchema.js
// ------------------------------------------------------------
// Zod validation for user preferences update payload.
// ------------------------------------------------------------
import { z } from 'zod';

// Allowed fields – adjust as needed.
const preferencesSchema = z.object({
  high_contrast_mode: z.boolean().optional(),
  font_size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
  language_code: z.string().min(2).max(5).optional(), // e.g., 'en', 'hi', 'en-US'
  auto_sos_alert: z.boolean().optional(),
  email_notifications: z.boolean().optional(),
  sms_notifications: z.boolean().optional(),
});

export const validatePreferences = (req, res, next) => {
  const result = preferencesSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PREFERENCES',
        message: result.error.errors[0].message,
      },
    });
  }
  req.body = result.data;
  next();
};
