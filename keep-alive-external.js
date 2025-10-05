const https = require('https');

const URL = 'https://arjuna-ai.onrender.com/api/ping';

function ping() {
  https.get(URL, (res) => {
    console.log(`${new Date().toISOString()} - Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`${new Date().toISOString()} - Error:`, err.message);
  });
}

ping();
setInterval(ping, 30000);