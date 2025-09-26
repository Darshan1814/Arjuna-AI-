import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const WEBSITE_CONTEXT = `
ARJUNA AI - Aadhaar Banking Portal Context:

Our website helps students with:
1. One-Time Registration (OTR) on NSP Portal (scholarships.gov.in)
2. Scholarship Application Process for Pre-Matric and Post-Matric scholarships
3. Aadhaar Seeding with Bank Account for DBT (Direct Benefit Transfer)
4. Track Application Status on NSP Portal
5. Renewal of Scholarship applications

Key Features:
- Yantra AI Assistant for Aadhaar and banking guidance
- LearnQuest - Interactive learning games with badges and points
- Progress Tracker for scholarship process steps
- DBT vs Aadhaar-linked account education
- Real-time chat support for banking queries

Important Links:
- NSP Portal: https://scholarships.gov.in
- DBT Portal: https://dbtbharat.gov.in
- UIDAI: https://uidai.gov.in

Common Issues We Solve:
- Students not understanding difference between Aadhaar-linked and DBT-enabled accounts
- Scholarship disbursement delays due to improper account seeding
- Confusion about OTR registration process
- Missing documentation for scholarship applications
- Bank account verification problems
`;

export async function POST(request) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `${WEBSITE_CONTEXT}

Generate a random interactive question related to our Aadhaar banking and scholarship portal. The question should be:
1. Practical and scenario-based
2. Related to real problems students face
3. Educational and engaging
4. Connected to our website's services

Return JSON with this structure:
{
  "question": "Interactive question text",
  "scenario": "Brief scenario description",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Why this answer is correct",
  "hints": ["hint1", "hint2", "hint3"],
  "relatedTopics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "difficulty": "easy/medium/hard",
  "category": "OTR/Application/Seeding/Tracking/Renewal"
}

Make it engaging and educational!`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const questionData = JSON.parse(jsonMatch[0]);
    
    return Response.json(questionData);

  } catch (error) {
    console.error('Game question generation error:', error);
    return Response.json({ 
      error: 'Failed to generate question',
      question: 'What is the difference between Aadhaar-linked and DBT-enabled bank accounts?',
      scenario: 'A student is confused about their bank account setup for scholarships.',
      options: ['Only Aadhaar number is linked', 'Account can receive government benefits directly', 'Same as regular bank account', 'Only for savings accounts'],
      correctAnswer: 1,
      explanation: 'DBT-enabled accounts can receive government benefits directly through proper Aadhaar seeding.',
      hints: ['DBT stands for Direct Benefit Transfer', 'Seeding is required for DBT', 'Visit your bank branch'],
      relatedTopics: ['Bank Seeding', 'DBT Portal', 'Scholarship Disbursement', 'NSP Registration', 'Account Verification'],
      difficulty: 'medium',
      category: 'Seeding'
    });
  }
}