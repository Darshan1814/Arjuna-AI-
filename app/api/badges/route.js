import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory badge collection (replace with real DB)
let badgeCollection = [
  { id: 1, userId: 1, name: 'First Steps', description: 'Completed first quiz', icon: '🎯', earnedAt: new Date() }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 1;
  
  const userBadges = badgeCollection.filter(badge => badge.userId == userId);
  return Response.json({ badges: userBadges });
}

export async function POST(request) {
  try {
    const { userId = 1, score, totalQuestions, topic } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Based on this quiz performance:
- Score: ${score}/${totalQuestions} (${Math.round((score/totalQuestions)*100)}%)
- Topic: ${topic}
- User Level: ${Math.floor(badgeCollection.filter(b => b.userId == userId).length / 3) + 1}

Generate a new badge if score >= 70%. Return JSON:
{
  "shouldAwardBadge": true/false,
  "badge": {
    "name": "Badge Name",
    "description": "Achievement description", 
    "icon": "emoji"
  },
  "dbtReadiness": number (0-100 based on performance)
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return Response.json({ error: 'Invalid response' }, { status: 500 });
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    if (analysis.shouldAwardBadge) {
      const newBadge = {
        id: badgeCollection.length + 1,
        userId,
        name: analysis.badge.name,
        description: analysis.badge.description,
        icon: analysis.badge.icon,
        earnedAt: new Date()
      };
      badgeCollection.push(newBadge);
    }
    
    return Response.json({
      success: true,
      newBadge: analysis.shouldAwardBadge ? analysis.badge : null,
      dbtReadiness: analysis.dbtReadiness,
      totalBadges: badgeCollection.filter(b => b.userId == userId).length
    });
    
  } catch (error) {
    console.error('Badge generation error:', error);
    return Response.json({ error: 'Failed to process badge' }, { status: 500 });
  }
}