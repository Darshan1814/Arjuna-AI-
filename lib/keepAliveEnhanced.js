// Enhanced keep-alive service for Render deployment
export function startKeepAlive() {
  if (typeof window === 'undefined') return; // Only run on client
  
  const baseUrl = process.env.NEXT_PUBLIC_RENDER_EXTERNAL_URL || window.location.origin;
  
  const pingEndpoints = [
    `${baseUrl}/api/ping`,
    `${baseUrl}/api/keep-alive`
  ];
  
  const pingServer = async () => {
    const promises = pingEndpoints.map(async (url) => {
      try {
        const response = await fetch(url, { 
          method: 'GET',
          headers: { 
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const data = await response.json();
        console.log(`✅ Ping successful: ${url}`, data.timestamp);
        return { url, success: true, data };
      } catch (error) {
        console.error(`❌ Ping failed: ${url}`, error.message);
        return { url, success: false, error: error.message };
      }
    });
    
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    console.log(`🏓 Keep-alive: ${successful}/${pingEndpoints.length} endpoints responded`);
  };
  
  // Ping immediately
  pingServer();
  
  // Set up intervals - ping every 8 minutes (well before 15-minute timeout)
  const interval = setInterval(pingServer, 8 * 60 * 1000);
  
  // Also ping when page becomes visible (user returns to tab)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      console.log('🔄 Page visible - sending keep-alive ping');
      pingServer();
    }
  });
  
  console.log('🚀 Enhanced keep-alive service started - pinging every 8 minutes');
  
  return () => clearInterval(interval);
}