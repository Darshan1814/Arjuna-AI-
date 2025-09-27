export async function GET() {
  const timestamp = new Date().toISOString();
  console.log('🟢 Keep-alive ping received at:', timestamp);
  return Response.json({ 
    status: 'alive', 
    timestamp,
    message: 'Server is awake and running!' 
  });
}