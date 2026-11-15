import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import app from '../src/app.js';
import { redactPII } from '../src/services/piiRedactor.js';
import { FallbackRuleEngine } from '../src/services/fallbackRuleEngine.js';

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('1. Health check returns 200 OK', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'healthy');
});

test('2. User Registration & Login Flow', async () => {
  const email = `test_${Date.now()}@example.com`;
  
  // Register
  const regRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password: 'SecurePassword#2026',
      fullName: 'Suresh Patel',
      phoneNumber: '+919876543210'
    })
  });
  assert.equal(regRes.status, 201);
  const regData = await regRes.json();
  assert.equal(regData.success, true);
  assert.ok(regData.data.accessToken);

  // Login
  const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password: 'SecurePassword#2026'
    })
  });
  assert.equal(loginRes.status, 200);
  const loginData = await loginRes.json();
  assert.equal(loginData.success, true);
  assert.ok(loginData.data.accessToken);
});

test('3. Protected profile endpoint requires Bearer token', async () => {
  // Without token
  const unauthRes = await fetch(`${baseUrl}/api/v1/users/profile`);
  assert.equal(unauthRes.status, 401);

  // With demo token
  const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'ramesh.chandra@example.com',
      password: 'SecurePassword#2026'
    })
  });
  const { data } = await loginRes.json();

  const authRes = await fetch(`${baseUrl}/api/v1/users/profile`, {
    headers: { Authorization: `Bearer ${data.accessToken}` }
  });
  assert.equal(authRes.status, 200);
  const profileData = await authRes.json();
  assert.equal(profileData.data.email, 'ramesh.chandra@example.com');
});

test('4. Message Analysis endpoint handles electricity scam text with PII redaction', async () => {
  const rawText = "Dear Customer, your electricity power will be disconnected tonight at 9:30 PM. Card 4532 8923 1122 3344 OTP 849201. Call officer 9876543210.";
  
  // Verify PII redaction utility
  const redacted = redactPII(rawText);
  assert.ok(!redacted.includes('4532 8923 1122 3344'));
  assert.ok(!redacted.includes('849201'));
  assert.ok(redacted.includes('[CARD-NUMBER-REDACTED]'));

  // Test API endpoint (Guest scan)
  const res = await fetch(`${baseUrl}/api/v1/analyze/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: rawText,
      senderHeader: 'VM-POWERT',
      consentGranted: true
    })
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.riskScore >= 70);
  assert.ok(['HIGH', 'CRITICAL'].includes(body.data.riskLevel));
});

test('5. QR Analysis endpoint flags deceptive reverse UPI collect intents', async () => {
  const qrUri = "upi://pay?pa=scammer@ybl&pn=RefundDesk&am=4999.00&cu=INR&tn=Cashback%20Refund";
  
  const res = await fetch(`${baseUrl}/api/v1/analyze/qr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      qrPayload: qrUri,
      consentGranted: true
    })
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.riskScore >= 70);
  assert.ok(body.data.actionableAdvice.length > 0);
});

test('6. URL Analysis endpoint flags typosquatted bank links', async () => {
  const res = await fetch(`${baseUrl}/api/v1/analyze/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'http://sbi-kyc-verify-portal.in/login.php',
      consentGranted: true
    })
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.riskScore >= 70);
});

test('7. Incident Response Reporting & Bank Hotlines', async () => {
  // Directory check
  const dirRes = await fetch(`${baseUrl}/api/v1/incidents/guidance/bank-hotlines`);
  assert.equal(dirRes.status, 200);
  const dirData = await dirRes.json();
  assert.ok(dirData.data.banks.length >= 5);

  // File report
  const repRes = await fetch(`${baseUrl}/api/v1/incidents/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      incidentType: 'UNAUTHORIZED_UPI_DEBIT',
      financialLossInr: 15000,
      bankName: 'State Bank of India',
      transactionRefRrn: '334455667788',
      notes: 'Debited via fake refund QR'
    })
  });

  assert.equal(repRes.status, 201);
  const repData = await repRes.json();
  assert.ok(repData.data.incidentId);
  assert.ok(repData.data.legalDisclaimer.includes('FraudShield CANNOT freeze your bank account'));
});
