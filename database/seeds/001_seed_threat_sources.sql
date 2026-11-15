-- FraudShield Seed Data: 001_seed_threat_sources.sql

INSERT INTO threat_sources (source_name, source_type, description, is_active, last_synced_at)
VALUES 
    ('TRAI_DLT_REGISTRY', 'TELECOM_HEADER', 'Telecom Regulatory Authority of India Commercial Distributed Ledger Technology Header Registry', TRUE, CURRENT_TIMESTAMP),
    ('NPCI_UPI_VPA_SCAM_FEED', 'PAYMENT_RAIL', 'National Payments Corporation of India Flagged Scammer Virtual Payment Addresses', TRUE, CURRENT_TIMESTAMP),
    ('I4C_CYBERCRIME_1930', 'LAW_ENFORCEMENT', 'Indian Cyber Crime Coordination Centre (I4C) Incident Database', TRUE, CURRENT_TIMESTAMP),
    ('CHAKSHU_SANCHAR_SAATHI', 'TELECOM_FRAUD', 'Department of Telecommunications Chakshu Suspected Fraud Reporting Feed', TRUE, CURRENT_TIMESTAMP),
    ('GOOGLE_SAFE_BROWSING', 'MALICIOUS_DOMAINS', 'Google Safe Browsing Phishing and Malware Domain Protection API', TRUE, CURRENT_TIMESTAMP)
ON CONFLICT (source_name) DO NOTHING;
