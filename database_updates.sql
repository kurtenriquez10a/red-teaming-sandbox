-- Database updates for keystroke-first logging workflow
-- Run these in your Neon SQL Editor

-- Add session tracking and submission status to existing tables
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS session_id_browser VARCHAR(255);
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS was_submitted BOOLEAN DEFAULT TRUE;
ALTER TABLE keystroke_logs ADD COLUMN IF NOT EXISTS session_id_browser VARCHAR(255);
ALTER TABLE keystroke_logs ADD COLUMN IF NOT EXISTS was_submitted BOOLEAN DEFAULT FALSE;

-- Create a new table for tracking form sessions (keystroke → potential submission)
CREATE TABLE IF NOT EXISTS form_sessions (
    id SERIAL PRIMARY KEY,
    session_id_browser VARCHAR(255) UNIQUE NOT NULL,
    first_keystroke_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_keystroke_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE NULL,
    was_submitted BOOLEAN DEFAULT FALSE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_form_submissions_session_browser ON form_submissions(session_id_browser);
CREATE INDEX IF NOT EXISTS idx_keystroke_logs_session_browser ON keystroke_logs(session_id_browser);
CREATE INDEX IF NOT EXISTS idx_form_sessions_browser_id ON form_sessions(session_id_browser);

-- Create a comprehensive view for red team analysis
CREATE OR REPLACE VIEW red_team_session_analysis AS
SELECT 
    fs.session_id_browser,
    fs.first_keystroke_at,
    fs.last_keystroke_at,
    fs.submitted_at,
    fs.was_submitted,
    fs.ip_address,
    fs.user_agent,
    COUNT(kl.id) as total_keystrokes,
    COUNT(CASE WHEN kl.field_name LIKE '%card%' THEN 1 END) as credit_card_keystrokes,
    COUNT(CASE WHEN kl.field_name = 'ssn' THEN 1 END) as ssn_keystrokes,
    MAX(CASE WHEN kl.field_name = 'employeeName' THEN kl.field_value END) as employee_name,
    MAX(CASE WHEN kl.field_name = 'cardNumber' THEN kl.field_value END) as card_number,
    MAX(CASE WHEN kl.field_name = 'ssn' THEN kl.field_value END) as ssn_value,
    CASE 
        WHEN fs.was_submitted THEN 'SUBMITTED'
        WHEN COUNT(kl.id) > 0 THEN 'TYPED_ONLY'
        ELSE 'NO_DATA'
    END as vulnerability_status
FROM form_sessions fs
LEFT JOIN keystroke_logs kl ON fs.session_id_browser = kl.session_id_browser
GROUP BY fs.session_id_browser, fs.first_keystroke_at, fs.last_keystroke_at, 
         fs.submitted_at, fs.was_submitted, fs.ip_address, fs.user_agent
ORDER BY fs.first_keystroke_at DESC;