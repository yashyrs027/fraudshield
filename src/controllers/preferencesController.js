// src/controllers/preferencesController.js
// ------------------------------------------------------------
// Handles user preference CRUD (GET and UPDATE) for FraudShield.
// ------------------------------------------------------------
// Uses the in‑memory `memoryStore` for now; when a real DB is
// configured the same logic can be swapped for a repository layer.

const { memoryStore } = require('../config/db');

// GET /users/:userId/preferences – returns the stored preferences.
async function getPreferences(req, res) {
  const userId = req.params.userId;
  // Ensure the request is for the authenticated user (simple check).
  if (req.user && req.user.id !== userId) {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Cannot access other user preferences' } });
  }
  const prefs = memoryStore.preferences.get(userId);
  if (!prefs) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Preferences not found' } });
  }
  return res.json({ success: true, data: prefs });
}

// PATCH /users/:userId/preferences – updates allowed preference fields.
async function updatePreferences(req, res) {
  const userId = req.params.userId;
  if (req.user && req.user.id !== userId) {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Cannot modify other user preferences' } });
  }
  const existing = memoryStore.preferences.get(userId) || {};
  const updated = { ...existing, ...req.body, updated_at: new Date().toISOString() };
  memoryStore.preferences.set(userId, updated);
  return res.json({ success: true, data: updated });
}

module.exports = {
  getPreferences,
  updatePreferences,
};
