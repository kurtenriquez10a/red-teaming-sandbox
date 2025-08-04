import { NextRequest } from 'next/server';
import { logger } from '../../../utils/lib/logger';
import { createTransparentPixel } from '../../../utils/api';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');
  const token = searchParams.get('token');
  
  // Log the pixel request
  await logger({
    type: 'pixel_request',
    timestamp: new Date().toISOString(),
    file,
    token,
    userAgent: request.headers.get('user-agent'),
    referer: request.headers.get('referer'),
    ip: request.headers.get('x-forwarded-for') || 'unknown'
  });
  
  // Return 1x1 transparent PNG
  const transparentPixel = createTransparentPixel();
  
  return new Response(transparentPixel, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}