import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { topic, difficulty } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Generate 10 multiple choice questions about ${topic || 'Aadhaar and DBT banking'} for ${difficulty || 'beginner'} level students. 

Focus on:
- Difference between Aadhaar-linked and DBT-enabled accounts
- Scholarship disbursement process
- Bank account seeding
- Government portals (NSP, DBT)
- Pre-matric and post-matric scholarships

Return ONLY a JSON object with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation why this answer is correct and others are wrong"
    }
  ]
}

Make questions practical and scenario-based. Ensure explanations are educational and helpful.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const mcqData = JSON.parse(jsonMatch[0]);
    
    return Response.json(mcqData);

  } catch (error) {
    console.error('MCQ generation error:', error);
    return Response.json({ 
      error: 'Failed to generate questions',
      questions: []
    }, { status: 500 });
  }
}