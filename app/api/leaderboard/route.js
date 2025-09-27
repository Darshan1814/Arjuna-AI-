export async function GET() {
  const mockLeaderboard = [
    { id: 1, name: 'You', points: 150, level: 2, badges: 3, dbtReady: 75, rank: 1 },
    { id: 2, name: 'Arjun', points: 120, level: 2, badges: 2, dbtReady: 60, rank: 2 },
    { id: 3, name: 'Priya', points: 100, level: 1, badges: 2, dbtReady: 50, rank: 3 },
    { id: 4, name: 'Rahul', points: 80, level: 1, badges: 1, dbtReady: 40, rank: 4 },
    { id: 5, name: 'Sneha', points: 60, level: 1, badges: 1, dbtReady: 30, rank: 5 }
  ];

  return Response.json({ 
    success: true,
    users: mockLeaderboard,
    leaderboard: mockLeaderboard
  });
}

export async function POST(request) {
  const body = await request.json();
  const { userId, pointsEarned, correctAnswers, totalQuestions, dbtReadiness, badgeCount } = body;

  // Mock user update
  const updatedUser = {
    points: 150 + (pointsEarned || 0),
    level: Math.floor((150 + (pointsEarned || 0)) / 100) + 1,
    badges: badgeCount || 3,
    dbtReady: dbtReadiness || 75
  };

  const mockLeaderboard = [
    { id: 1, name: 'You', ...updatedUser, rank: 1 },
    { id: 2, name: 'Arjun', points: 120, level: 2, badges: 2, dbtReady: 60, rank: 2 },
    { id: 3, name: 'Priya', points: 100, level: 1, badges: 2, dbtReady: 50, rank: 3 }
  ];

  return Response.json({
    success: true,
    user: updatedUser,
    leaderboard: mockLeaderboard
  });
}