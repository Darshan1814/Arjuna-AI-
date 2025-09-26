// Simple in-memory database for demo (replace with real DB in production)
let users = [
  { id: 1, name: 'You', points: 0, level: 1, badges: 0, dbtReady: 0, rank: 1, testsCompleted: 0, questionsAnswered: 0 },
  { id: 2, name: 'Rahul Kumar', points: 145, level: 2, badges: 2, dbtReady: 70, rank: 2, testsCompleted: 15, questionsAnswered: 150 },
  { id: 3, name: 'Priya Singh', points: 132, level: 1, badges: 2, dbtReady: 65, rank: 3, testsCompleted: 13, questionsAnswered: 130 },
  { id: 4, name: 'Amit Sharma', points: 120, level: 1, badges: 1, dbtReady: 60, rank: 4, testsCompleted: 12, questionsAnswered: 120 },
  { id: 5, name: 'Sneha Patel', points: 110, level: 1, badges: 1, dbtReady: 55, rank: 5, testsCompleted: 11, questionsAnswered: 110 }
];

export async function GET() {
  // Sort by points and update ranks
  users.sort((a, b) => b.points - a.points);
  users.forEach((user, index) => {
    user.rank = index + 1;
  });

  return Response.json({ users });
}

export async function POST(request) {
  try {
    const { userId = 1, pointsEarned, correctAnswers, totalQuestions, dbtReadiness, badgeCount } = await request.json();
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].points += pointsEarned;
      users[userIndex].questionsAnswered += totalQuestions;
      users[userIndex].testsCompleted += 1;
      users[userIndex].dbtReady = dbtReadiness || users[userIndex].dbtReady;
      users[userIndex].badges = badgeCount || users[userIndex].badges;
      
      // Level progression: Level 1->2 needs 10 questions, Level 2->3 needs 20 questions, etc.
      const questionsForNextLevel = users[userIndex].level * 10;
      if (users[userIndex].questionsAnswered >= questionsForNextLevel) {
        users[userIndex].level += 1;
      }
    }

    // Sort and update ranks
    users.sort((a, b) => b.points - a.points);
    users.forEach((user, index) => {
      user.rank = index + 1;
    });

    return Response.json({ 
      success: true, 
      user: users[userIndex],
      leaderboard: users.slice(0, 5)
    });
  } catch (error) {
    return Response.json({ error: 'Failed to update user stats' }, { status: 500 });
  }
}