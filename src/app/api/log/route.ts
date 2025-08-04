import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../../../utils/lib/logger';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST');
}

async function handleRequest(request: NextRequest, method: string) {
  let body = null;
  
  try {
    if (method === 'POST') {
      body = await request.text();
    }
  } catch {
    // Ignore body parsing errors
  }
  
  // Convert headers to object
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  
  // Log the request
  await logger({
    type: 'generic_log',
    timestamp: new Date().toISOString(),
    method,
    url: request.url,
    headers,
    body,
    ip: request.headers.get('x-forwarded-for') || 'unknown'
  });
  
  return NextResponse.json({ status: 'logged' });
}