// server/tests/incident.test.js
// ------------------------------------------------------------
// Native Node test runner + SuperTest integration tests for Incident endpoints
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

// Test incident report creation
test('POST /incidents/report creates an incident record', async (t) => {
  const payload = {
    incidentType: 'UNAUTHORIZED_UPI',
    financialLossInr: 1200,
    bankName: 'State Bank of India',
    transactionRefRrn: '123456789012',
    notes: 'Unexpected transaction',
    sessionId: 'sess-12345',
  };
  const res = await request(app)
    .post('/api/v1/incidents/report')
    .set('Authorization', `Bearer ${authToken}`)
    .send(payload)
    .expect(201);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.data.incidentId);
  assert.ok(res.body.data.legalDisclaimer);
});

// Test hotlines lookup
test('GET /incidents/guidance/bank-hotlines returns hotlines', async (t) => {
  const res = await request(app)
    .get('/api/v1/incidents/guidance/bank-hotlines')
    .set('Authorization', `Bearer ${authToken}`)
    .expect(200);
  assert.strictEqual(res.body.success, true);
  assert.ok(Array.isArray(res.body.data.banks));
});
