// server/tests/preferences.test.js
// ------------------------------------------------------------
// Native Node test runner + SuperTest integration tests for Preferences endpoints
// ------------------------------------------------------------
import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { memoryStore } from '../src/config/db.js';

let authToken = '';
let demoUserId = '';

// Setup – obtain auth token for the demo user
before(async () => {
  const demoUser = Array.from(memoryStore.users.values()).find(u => u.email === 'ramesh.chandra@example.com');
  demoUserId = demoUser.id;
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: demoUser.email, password: 'SecurePassword#2026' })
    .expect(200);
  authToken = loginRes.body.data.accessToken;
});

// GET preferences
test('GET preferences returns stored prefs', async (t) => {
  const res = await request(app)
    .get(`/api/v1/preferences/${demoUserId}`)
    .set('Authorization', `Bearer ${authToken}`)
    .expect(200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.data.language_code);
  assert.strictEqual(res.body.data.language_code, 'en');
});

// PATCH preferences – valid update
test('PATCH preferences updates mutable fields', async (t) => {
  const newPrefs = { language_code: 'hi', high_contrast_mode: true };
  const res = await request(app)
    .patch(`/api/v1/preferences/${demoUserId}`)
    .set('Authorization', `Bearer ${authToken}`)
    .send(newPrefs)
    .expect(200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.data.language_code, 'hi');
  assert.strictEqual(res.body.data.high_contrast_mode, true);
});

// PATCH preferences – invalid payload
test('PATCH with invalid payload returns 400', async (t) => {
  const res = await request(app)
    .patch(`/api/v1/preferences/${demoUserId}`)
    .set('Authorization', `Bearer ${authToken}`)
    .send({ language_code: 123 })
    .expect(400);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.error.code, 'INVALID_PREFERENCES');
});
