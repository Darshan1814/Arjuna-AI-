// Keep server alive by pinging every 5 minutes
export function startKeepAlive() {
  if (typeof window === 'undefined') return; // Only run on client
  
  const pingServer = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_RENDER_EXTERNAL_URL || window.location.origin;
      const pingUrl = `${baseUrl}/api/ping`;
      console.log('🏓 Pinging server to keep alive...', new Date().toLocaleTimeString());
      console.log('🔗 Ping URL:', pingUrl);
      
      const response = await fetch(pingUrl, { method: 'GET' });
      const data = await response.json();
      console.log('✅ Keep-alive ping successful:', data);
    } catch (error) {
      console.error('❌ Keep-alive ping failed:', error);
    }
  };
  
  console.log('🚀 Starting keep-alive service - will ping every 5 minutes');
  // Ping immediately and then every 5 minutes
  pingServer();
  setInterval(pingServer, 5 * 60 * 1000);
}