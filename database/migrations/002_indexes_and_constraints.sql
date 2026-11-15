-- FraudShield Database Migration: 002_indexes_and_constraints.sql
-- Performance Indexes & Relational Integrity Constraints

-- 1. Indexes for User Lookups & Authentication
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Indexes for Trusted Contacts
CREATE INDEX IF NOT EXISTS idx_trusted_contacts_user_id ON trusted_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_trusted_contacts_active ON trusted_contacts(user_id) WHERE is_active = TRUE;

-- 3. Indexes for Analysis Sessions
CREATE INDEX IF NOT EXISTS idx_analysis_sessions_user_id ON analysis_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_sessions_token ON analysis_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_analysis_sessions_created ON analysis_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_sessions_ip_hash ON analysis_sessions(client_ip_hash);

-- 4. GIN Indexes for Fast JSONB Threat Entity Matching
CREATE INDEX IF NOT EXISTS idx_message_analyses_entities ON message_analyses USING gin (extracted_entities);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_factors ON risk_assessments USING gin (factor_contributions);
CREATE INDEX IF NOT EXISTS idx_audit_logs_metadata ON audit_logs USING gin (metadata);

-- 5. Risk Assessment Lookups
CREATE INDEX IF NOT EXISTS idx_risk_assessments_level ON risk_assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_threat_indicators_assessment ON threat_indicators(assessment_id);
CREATE INDEX IF NOT EXISTS idx_threat_indicators_code ON threat_indicators(indicator_code);

-- 6. Incident Records
CREATE INDEX IF NOT EXISTS idx_incident_records_user_id ON incident_records(user_id);
CREATE INDEX IF NOT EXISTS idx_incident_records_status ON incident_records(status);
CREATE INDEX IF NOT EXISTS idx_incident_records_time ON incident_records(incident_time DESC);

-- 7. Consent Records (Audit trail)
CREATE INDEX IF NOT EXISTS idx_consent_records_user ON consent_records(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_session ON consent_records(session_id);

-- Check Constraints for Indian Phone Syntax and Values
ALTER TABLE users DROP CONSTRAINT IF EXISTS check_phone_format;
ALTER TABLE users ADD CONSTRAINT check_phone_format 
    CHECK (phone_number IS NULL OR phone_number ~ '^\+91[6-9][0-9]{9}$');

ALTER TABLE trusted_contacts DROP CONSTRAINT IF EXISTS check_contact_phone;
ALTER TABLE trusted_contacts ADD CONSTRAINT check_contact_phone 
    CHECK (phone_number ~ '^\+91[6-9][0-9]{9}$');
