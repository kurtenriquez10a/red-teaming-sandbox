// Session management for linking keystrokes to submissions
export function generateBrowserSessionId(): string {
  // Generate a unique session ID for this browser session
  if (typeof window !== 'undefined') {
    let sessionId = sessionStorage.getItem('redteam_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('redteam_session_id', sessionId);
    }
    return sessionId;
  }
  // Fallback for server-side
  return `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getBrowserSessionId(): string {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('redteam_session_id') || generateBrowserSessionId();
  }
  return 'server_session';
}