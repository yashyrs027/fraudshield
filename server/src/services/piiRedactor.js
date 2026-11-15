/**
 * PII & Financial Sensitive Data Redaction Utility
 * Enforces DPDP Act 2023 Compliance & Zero Storage of Banking Secrets
 */

// 16-digit Card Number pattern
const CARD_REGEX = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;

// 12-digit Aadhaar pattern
const AADHAAR_REGEX = /\b\d{4}\s?\d{4}\s?\d{4}\b/g;

// OTP tokens
const OTP_REGEX = /(?:otp|one time password|verification code)\s*(?:is|:)?\s*(\b\d{4,6}\b)/gi;

// CVV tokens
const CVV_REGEX = /(?:cvv|cvc|security code)\s*[:=]?\s*(\b\d{3,4}\b)/gi;

// UPI PIN / Password tokens
const PIN_PASSWORD_REGEX = /(?:upi\s*pin|password|pwd|secret pin)\s*[:=]?\s*([a-zA-Z0-9!@#$%^&*]{4,20})/gi;

export const redactPII = (text) => {
  if (!text || typeof text !== 'string') return text;

  let redacted = text;

  // Mask 16-digit Credit/Debit Cards
  redacted = redacted.replace(CARD_REGEX, '[CARD-NUMBER-REDACTED]');

  // Mask 12-digit Aadhaar Cards
  redacted = redacted.replace(AADHAAR_REGEX, '[AADHAAR-REDACTED]');

  // Mask CVVs
  redacted = redacted.replace(CVV_REGEX, (match, cvv) => match.replace(cvv, '[CVV-REDACTED]'));

  // Mask OTPs
  redacted = redacted.replace(OTP_REGEX, (match, otp) => match.replace(otp, '[OTP-REDACTED]'));

  // Mask UPI PINs & Passwords
  redacted = redacted.replace(PIN_PASSWORD_REGEX, (match, secret) => match.replace(secret, '[SECRET-REDACTED]'));

  return redacted;
};
