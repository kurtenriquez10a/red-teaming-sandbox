// Edge runtime compatible logger
export async function logger(entry: Record<string, unknown>) {
  try {
    // For Edge runtime, we'll use console.log with a special format
    // In production, this could be replaced with external logging service
    console.log('SECURITY_LOG:', JSON.stringify(entry));
    
    // Optional: Send to external logging endpoint
    // fetch('https://your-logging-service.com/log', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(entry)
    // });
    
  } catch (error) {
    console.error("Logger error:", error);
  }
}