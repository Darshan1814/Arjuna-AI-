// External cron job to keep Render server alive
const https = require('https');

const RENDER_URL = 'https://arjuna-ai.onrender.com';

function pingServer() {
  const endpoints = ['/api/ping', '/api/keep-alive'];
  
  endpoints.forEach(endpoint => {
    const url = `${RENDER_URL}${endpoint}`;
    
    https.get(url, (res) => {
      console.log(`✅ ${endpoint}: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`❌ ${endpoint}:`, err.message);
    });
  });
}

// Run immediately and every 30 seconds
pingServer();
setInterval(pingServer, 30 * 1000);