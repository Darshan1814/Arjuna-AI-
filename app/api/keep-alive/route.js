export async function GET() {
  const timestamp = new Date().toISOString();
  console.log('🟢 Keep-alive ping received at:', timestamp);
  
  // Perform a simple operation to keep server active
  const memoryUsage = process.memoryUsage();
  
  return Response.json({ 
    status: 'alive', 
    timestamp,
    message: 'Server is awake and running!',
    uptime: process.uptime(),
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB'
    }
  });
}

export async function POST() {
  return GET(); // Handle both GET and POST requests
}