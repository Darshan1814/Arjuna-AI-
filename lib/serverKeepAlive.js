// Server-side keep-alive for Render
const https = require('https');
const http = require('http');

class ServerKeepAlive {
  constructor() {
    this.interval = null;
    this.isRunning = false;
    this.baseUrl = process.env.NEXT_PUBLIC_RENDER_EXTERNAL_URL || 'https://arjuna-ai.onrender.com';
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      
      const req = protocol.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Render-KeepAlive/1.0',
          'Cache-Control': 'no-cache'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`✅ Keep-alive ping successful: ${res.statusCode}`);
          resolve({ status: res.statusCode, data });
        });
      });

      req.on('error', (error) => {
        console.error(`❌ Keep-alive ping failed:`, error.message);
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  async pingServer() {
    const endpoints = [
      `${this.baseUrl}/api/ping`,
      `${this.baseUrl}/api/keep-alive`
    ];

    console.log(`🏓 Server keep-alive ping at ${new Date().toISOString()}`);
    
    for (const endpoint of endpoints) {
      try {
        await this.makeRequest(endpoint);
      } catch (error) {
        console.error(`Failed to ping ${endpoint}:`, error.message);
      }
    }
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🚀 Starting server-side keep-alive service');
    
    // Ping immediately
    this.pingServer();
    
    // Ping every 10 minutes (600,000ms)
    this.interval = setInterval(() => {
      this.pingServer();
    }, 10 * 60 * 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('🛑 Server keep-alive service stopped');
  }
}

module.exports = new ServerKeepAlive();