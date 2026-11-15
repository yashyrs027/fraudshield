-- FraudShield Database Migration: 003_rls_policies.sql
-- Row-Level Security (RLS) for Supabase / Multi-Tenant Isolation

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_records ENABLE ROW LEVEL SECURITY;

-- 1. Users can only read and update their own identity
DROP POLICY IF EXISTS user_read_own ON users;
CREATE POLICY user_read_own ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS user_update_own ON users;
CREATE POLICY user_update_own ON users
    FOR UPDATE USING (auth.uid() = id);

-- 2. User Preferences
DROP POLICY IF EXISTS pref_manage_own ON user_preferences;
CREATE POLICY pref_manage_own ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- 3. Trusted Contacts
DROP POLICY IF EXISTS contacts_manage_own ON trusted_contacts;
CREATE POLICY contacts_manage_own ON trusted_contacts
    FOR ALL USING (auth.uid() = user_id);

-- 4. Analysis Sessions: Authenticated users view their own sessions; Guests view sessions with matching token
DROP POLICY IF EXISTS sessions_read_own ON analysis_sessions;
CREATE POLICY sessions_read_own ON analysis_sessions
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- 5. Incident Records
DROP POLICY IF EXISTS incidents_manage_own ON incident_records;
CREATE POLICY incidents_manage_own ON incident_records
    FOR ALL USING (auth.uid() = user_id);
