// Keep server alive by pinging every 5 minutes
export function startKeepAlive() {
  if (typeof window === 'undefined') return; // Only run on client
  
  const pingServer = async () => {
    try {
      await fetch('/api/ping', { method: 'GET' });
    } catch (error) {
      console.log('Keep-alive ping failed:', error);
    }
  };
  
  // Ping immediately and then every 5 minutes
  pingServer();
  setInterval(pingServer, 5 * 60 * 1000);
}