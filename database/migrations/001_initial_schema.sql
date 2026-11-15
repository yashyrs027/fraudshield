-- FraudShield Database Migration: 001_initial_schema.sql
-- Normalized 3NF PostgreSQL Schema for Indian FinTech Cyber Fraud Prevention

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Domain Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('USER', 'VERIFIED_USER', 'FAMILY_GUARDIAN', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE input_type_enum AS ENUM ('TEXT_MESSAGE', 'QR_IMAGE', 'PAYMENT_SCREENSHOT', 'URL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_status_enum AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_level_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE severity_enum AS ENUM ('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE incident_status_enum AS ENUM ('DRAFT', 'SUBMITTED_TO_BANK', 'REPORTED_1930', 'RESOLVED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role NOT NULL DEFAULT 'USER',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    refresh_token_hash VARCHAR(255),
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    lockout_until TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- 2. User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    high_contrast_mode BOOLEAN NOT NULL DEFAULT FALSE,
    font_size VARCHAR(15) NOT NULL DEFAULT 'MEDIUM',
    language_code VARCHAR(10) NOT NULL DEFAULT 'en',
    auto_sos_alert BOOLEAN NOT NULL DEFAULT TRUE,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    sms_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Trusted Contacts Table (Family Guardians)
CREATE TABLE IF NOT EXISTS trusted_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_name VARCHAR(150) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Analysis Sessions Table (Supports Guest and Authenticated Scans)
CREATE TABLE IF NOT EXISTS analysis_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_token VARCHAR(64) NOT NULL UNIQUE,
    input_type input_type_enum NOT NULL,
    client_ip_hash VARCHAR(64) NOT NULL,
    user_agent TEXT,
    status session_status_enum NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

-- 5. Message Analyses Table (Masked Text & Entities)
CREATE TABLE IF NOT EXISTS message_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL UNIQUE REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    redacted_content TEXT NOT NULL,
    sender_header VARCHAR(50),
    detected_language VARCHAR(10) DEFAULT 'en',
    scam_category VARCHAR(100),
    extracted_entities JSONB NOT NULL DEFAULT '{}'::jsonb,
    urgency_score NUMERIC(5,2) NOT NULL DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. QR & UPI Analyses Table (Decoded Parameters)
CREATE TABLE IF NOT EXISTS qr_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL UNIQUE REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    raw_qr_payload TEXT NOT NULL,
    is_upi_scheme BOOLEAN NOT NULL DEFAULT FALSE,
    upi_vpa VARCHAR(255),
    payee_name VARCHAR(255),
    merchant_code VARCHAR(20),
    requested_amount NUMERIC(12,2),
    is_collect_request BOOLEAN NOT NULL DEFAULT FALSE,
    warning_flag VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. URL Analyses Table (Safety & Typosquatting)
CREATE TABLE IF NOT EXISTS url_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL UNIQUE REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    original_url TEXT NOT NULL,
    resolved_destination_url TEXT NOT NULL,
    redirect_hops INTEGER NOT NULL DEFAULT 0,
    domain_name VARCHAR(255) NOT NULL,
    domain_age_days INTEGER,
    is_typosquatting BOOLEAN NOT NULL DEFAULT FALSE,
    targeted_brand VARCHAR(100),
    contains_direct_apk BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Risk Assessments Table (Explainable Score & Verdict)
CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL UNIQUE REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    composite_risk_score INTEGER NOT NULL CHECK (composite_risk_score >= 0 AND composite_risk_score <= 100),
    risk_level risk_level_enum NOT NULL,
    factor_contributions JSONB NOT NULL DEFAULT '[]'::jsonb,
    summary_verdict TEXT NOT NULL,
    actionable_advice JSONB NOT NULL DEFAULT '[]'::jsonb,
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Threat Sources Table
CREATE TABLE IF NOT EXISTS threat_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_name VARCHAR(100) NOT NULL UNIQUE,
    source_type VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_synced_at TIMESTAMPTZ
);

-- 10. Threat Indicators Table (Granular Cues)
CREATE TABLE IF NOT EXISTS threat_indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES risk_assessments(id) ON DELETE CASCADE,
    source_id UUID REFERENCES threat_sources(id) ON DELETE SET NULL,
    indicator_code VARCHAR(100) NOT NULL,
    severity severity_enum NOT NULL,
    description TEXT NOT NULL,
    weight NUMERIC(5,2) NOT NULL DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Incident Records Table
CREATE TABLE IF NOT EXISTS incident_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES analysis_sessions(id) ON DELETE SET NULL,
    incident_type VARCHAR(100) NOT NULL,
    financial_loss_inr NUMERIC(12,2) DEFAULT 0.00,
    bank_name VARCHAR(100),
    transaction_ref_rrn VARCHAR(50),
    cybercrime_ack_number VARCHAR(100),
    status incident_status_enum NOT NULL DEFAULT 'DRAFT',
    notes TEXT,
    incident_time TIMESTAMPTZ NOT NULL,
    reported_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Consent Records Table (DPDP Act 2023 Compliance)
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL,
    consent_version VARCHAR(20) NOT NULL DEFAULT 'v1.0',
    consent_granted BOOLEAN NOT NULL DEFAULT TRUE,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. Audit Logs Table (Tamper-Resistant)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    ip_address INET,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
