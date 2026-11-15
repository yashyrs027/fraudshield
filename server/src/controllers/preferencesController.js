// server/src/controllers/preferencesController.js
// ------------------------------------------------------------
// User Preferences CRUD for the FraudShield backend.
// ------------------------------------------------------------
// Uses the in‑memory `memoryStore` (fallback) and can be swapped for a
// PostgreSQL repository when a real DB is configured.

import { memoryStore } from '../config/db.js';

/**
 * GET /preferences/:userId
 * Returns stored preferences for the authenticated user.
 */
export async function getPreferences(req, res) {
  const { userId } = req.params;
  if (req.user && req.user.id !== userId) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Cannot access other user preferences' },
    });
  }

  const prefs = memoryStore.preferences.get(userId);
  if (!prefs) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Preferences not found' },
    });
  }
  return res.json({ success: true, data: prefs });
}

/**
 * PATCH /preferences/:userId
 * Updates mutable preference fields.
 */
export async function updatePreferences(req, res) {
  const { userId } = req.params;
  if (req.user && req.user.id !== userId) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Cannot modify other user preferences' },
    });
  }

  const existing = memoryStore.preferences.get(userId) || {};
  const updated = { ...existing, ...req.body, updated_at: new Date().toISOString() };
  memoryStore.preferences.set(userId, updated);
  return res.json({ success: true, data: updated });
}
