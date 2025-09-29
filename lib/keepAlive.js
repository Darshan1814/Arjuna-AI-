// Keep server alive by pinging every 10 minutes (Render sleeps after 15 minutes)
export function startKeepAlive() {
  if (typeof window === 'undefined') return; // Only run on client
  
  const pingServer = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_RENDER_EXTERNAL_URL || window.location.origin;
      const pingUrl = `${baseUrl}/api/ping`;
      console.log('🏓 Pinging server to keep alive...', new Date().toLocaleTimeString());
      
      const response = await fetch(pingUrl, { 
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await response.json();
      console.log('✅ Keep-alive ping successful:', data);
    } catch (error) {
      console.error('❌ Keep-alive ping failed:', error);
    }
  };
  
  console.log('🚀 Starting keep-alive service - will ping every 10 minutes');
  // Ping immediately and then every 10 minutes
  pingServer();
  setInterval(pingServer, 10 * 60 * 1000);
}