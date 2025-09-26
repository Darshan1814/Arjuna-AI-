import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const AADHAAR_CONTEXT = `
You are Yantra, a specialized AI assistant focused on helping students understand Aadhaar and banking services for scholarship disbursement. Your primary expertise is in:

1. AADHAAR-LINKED vs DBT-ENABLED BANK ACCOUNTS:
   - Aadhaar-linked: Basic linking of Aadhaar number with bank account
   - DBT-enabled: Advanced seeding that enables Direct Benefit Transfer for government schemes

2. KEY DIFFERENCES:
   - Aadhaar-linked accounts may not receive government benefits
   - DBT-enabled accounts are required for scholarship disbursement
   - DBT requires proper seeding through bank or online portals

3. SCHOLARSHIP DISBURSEMENT PROCESS:
   - Pre-Matric and Post-Matric scholarships for SC students
   - Funds transferred only to DBT-enabled accounts
   - Common delays due to improper account seeding

4. STEP-BY-STEP GUIDANCE:
   - Visit your bank branch with Aadhaar card
   - Request DBT enablement/seeding
   - Verify through DBT portal (dbtbharat.gov.in)
   - Update scholarship portal with correct account details

5. IMPORTANT LINKS:
   - DBT Portal: https://dbtbharat.gov.in/
   - NSP Portal: https://scholarships.gov.in/
   - UIDAI: https://uidai.gov.in/

Always provide practical, actionable advice and include relevant links when helpful.
`;

export async function POST(request) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `${AADHAAR_CONTEXT}

User Question: ${message}

Please provide a helpful, accurate response about Aadhaar seeding, DBT-enabled accounts, or scholarship disbursement. Include step-by-step guidance when appropriate and relevant links.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    return Response.json({ reply });

  } catch (error) {
    console.error('Yantra chat error:', error);
    
    // Check for API key issues
    if (error.message?.includes('API_KEY') || error.status === 401) {
      return Response.json({ 
        error: 'Configuration Error',
        reply: 'API key configuration issue. Please check the setup.'
      }, { status: 200 });
    }
    
    // Check for network issues
    if (error.message?.includes('fetch') || error.code === 'ENOTFOUND') {
      return Response.json({ 
        error: 'Network Error',
        reply: 'Connection issue detected. Please check your internet connection and try again.'
      }, { status: 200 });
    }
    
    return Response.json({ 
      error: 'API Error',
      reply: 'I encountered an error processing your request. Please try again in a moment.'
    }, { status: 200 });
  }
}