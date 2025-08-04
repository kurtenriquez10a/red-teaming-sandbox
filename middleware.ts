import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Convert headers to object
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Create log entry
  const logEntry = {
    timestamp: new Date().toISOString(),
    url: request.url,
    method: request.method,
    headers,
    ip: request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown'
  };

  // Log to console for Edge runtime compatibility
  console.log('MIDDLEWARE_LOG:', JSON.stringify(logEntry));

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};