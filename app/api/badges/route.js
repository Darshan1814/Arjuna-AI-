export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const mockBadges = [
    { id: 1, name: 'DBT Beginner', icon: '🎯', description: 'Completed first DBT quiz' },
    { id: 2, name: 'Aadhaar Expert', icon: '🆔', description: 'Mastered Aadhaar seeding' },
    { id: 3, name: 'Banking Pro', icon: '🏦', description: 'Understood DBT vs Aadhaar-linked accounts' }
  ];

  return Response.json({
    success: true,
    badges: mockBadges,
    totalBadges: mockBadges.length
  });
}

export async function POST(request) {
  const body = await request.json();
  const { userId, score, totalQuestions, topic } = body;

  const percentage = Math.round((score / totalQuestions) * 100);
  let newBadge = null;
  let dbtReadiness = 75;

  // Award badge based on performance
  if (percentage >= 80) {
    newBadge = { 
      id: Date.now(), 
      name: 'Quiz Master', 
      icon: '🏆', 
      description: `Scored ${percentage}% on ${topic}` 
    };
    dbtReadiness = Math.min(100, dbtReadiness + 10);
  } else if (percentage >= 70) {
    newBadge = { 
      id: Date.now(), 
      name: 'Good Learner', 
      icon: '⭐', 
      description: `Scored ${percentage}% on ${topic}` 
    };
    dbtReadiness = Math.min(100, dbtReadiness + 5);
  }

  return Response.json({
    success: true,
    newBadge,
    dbtReadiness,
    totalBadges: 3 + (newBadge ? 1 : 0)
  });
}