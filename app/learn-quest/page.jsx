"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Star, Target, Award, BookOpen, CheckCircle, X, Lightbulb, Users, Gamepad2, Brain, Zap, Send, MessageCircle } from "lucide-react";

export default function LearnQuest() {
  const router = useRouter();
  const [userStats, setUserStats] = useState({ points: 0, level: 1, badges: 0, dbtReady: 0 });
  const [userBadges, setUserBadges] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [missions, setMissions] = useState([
    { id: 1, title: 'Check Aadhaar Seeding', completed: true, points: 25 },
    { id: 2, title: 'Understand DBT vs Aadhaar-linked', completed: false, points: 30 },
    { id: 3, title: 'Verify Bank Details', completed: false, points: 20 }
  ]);

  useEffect(() => {
    fetchLeaderboard();
    fetchUserBadges();
  }, []);

  const fetchUserBadges = async () => {
    try {
      const response = await fetch('/api/badges?userId=1');
      const data = await response.json();
      setUserBadges(data.badges || []);
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data.users || []);
      const currentUser = data.users.find(u => u.name === 'You');
      if (currentUser) {
        setUserStats({
          points: currentUser.points,
          level: currentUser.level,
          badges: currentUser.badges,
          dbtReady: currentUser.dbtReady
        });
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  const updateUserStats = async (pointsEarned, correctAnswers, totalQuestions) => {
    try {
      const score = correctAnswers;
      const percentage = Math.round((score / totalQuestions) * 100);
      
      // Check for new badge and DBT readiness update
      const badgeResponse = await fetch('/api/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: 1, 
          score, 
          totalQuestions, 
          topic: currentQuiz?.title || 'General Quiz'
        })
      });
      const badgeData = await badgeResponse.json();
      
      // Update leaderboard with new stats
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: 1, 
          pointsEarned, 
          correctAnswers, 
          totalQuestions,
          dbtReadiness: badgeData.dbtReadiness,
          badgeCount: badgeData.totalBadges
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setUserStats({
          points: data.user.points,
          level: data.user.level,
          badges: data.user.badges,
          dbtReady: data.user.dbtReady
        });
        setLeaderboard(data.leaderboard);
        
        // Show congratulations if score >= 70% or new badge
        if (percentage >= 70 || badgeData.newBadge) {
          setNewBadge(badgeData.newBadge);
          setShowCongrats(true);
          if (badgeData.newBadge) {
            fetchUserBadges(); // Refresh badges
          }
        }
      }
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  };

  const generateQuiz = async (topic = 'Aadhaar and DBT banking', difficulty = 'beginner') => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-mcq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty })
      });
      const data = await response.json();
      setQuestions(data.questions || []);
      setCurrentQuiz({ title: topic, difficulty });
      setCurrentQuestion(0);
      setUserAnswers([]);
      setShowResults(false);
      setSelectedSection('quiz');
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    }
    setLoading(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = async () => {
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowExplanation(true);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newAnswers);
    setSubmitting(false);
  };

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResults(true);
      const correctAnswers = userAnswers.filter(
        (answer, index) => answer === questions[index].correctAnswer
      ).length;
      const earnedPoints = correctAnswers * 10;
      await updateUserStats(earnedPoints, correctAnswers, questions.length);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResults(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSelectedSection('dashboard');
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6" /> Mission Dashboard
        </h2>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">DBT Readiness Level</span>
            <span className="text-sm text-indigo-600">{userStats.dbtReady}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-green-400 to-indigo-500 h-3 rounded-full transition-all duration-500" style={{width: `${userStats.dbtReady}%`}}></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {missions.map((mission) => (
            <div key={mission.id} className={`p-4 rounded-xl border-2 ${mission.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                {mission.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
              <p className="text-sm text-gray-600">+{mission.points} points</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <Gamepad2 className="w-6 h-6" /> Interactive Scenario Quests
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Questions are being framed for you, wait a sec...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border-2 border-orange-200 bg-orange-50 rounded-xl cursor-pointer hover:shadow-md transition-all" onClick={() => generateQuiz('Bank account missing DBT scenario', 'intermediate')}>
              <h3 className="font-semibold text-gray-900 mb-2">🏦 Bank DBT Issue</h3>
              <p className="text-sm text-gray-600">Fix missing DBT enablement</p>
            </div>
            <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-xl cursor-pointer hover:shadow-md transition-all" onClick={() => generateQuiz('Aadhaar seeding incomplete scenario', 'intermediate')}>
              <h3 className="font-semibold text-gray-900 mb-2">🆔 Seeding Problem</h3>
              <p className="text-sm text-gray-600">Complete Aadhaar seeding</p>
            </div>
            <div className="p-4 border-2 border-purple-200 bg-purple-50 rounded-xl cursor-pointer hover:shadow-md transition-all" onClick={() => generateQuiz('Scholarship pending documentation', 'advanced')}>
              <h3 className="font-semibent text-gray-900 mb-2">🎓 Scholarship Pending</h3>
              <p className="text-sm text-gray-600">Resolve documentation issues</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <MessageCircle className="w-6 h-6" /> Game with Yantra
        </h2>
        <div className="mb-6">
          <div className="p-4 border-2 border-indigo-200 bg-indigo-50 rounded-xl cursor-pointer hover:shadow-md transition-all" onClick={() => router.push('/game-with-yantra')}>
            <div className="flex items-center gap-3 mb-2">
              <img src="/yantra.png" alt="Yantra" className="w-8 h-8 rounded-full" />
              <h3 className="font-semibold text-gray-900">🎯 Interactive Challenge</h3>
            </div>
            <p className="text-sm text-gray-600">Get random questions from Yantra and discuss solutions interactively</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6" /> Knowledge Arena
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border-2 border-green-200 bg-green-50 rounded-xl cursor-pointer hover:shadow-md transition-all" onClick={() => generateQuiz('Quick Aadhaar and DBT concepts', 'beginner')}>
            <Zap className="w-8 h-8 text-green-500 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Quick Quiz</h3>
            <p className="text-sm text-gray-600">1-minute challenges</p>
          </div>
          <div className="p-4 border-2 border-yellow-200 bg-yellow-50 rounded-xl cursor-pointer hover:shadow-md transition-all" onClick={() => generateQuiz('DBT vs Aadhaar-linked definitions', 'beginner')}>
            <BookOpen className="w-8 h-8 text-yellow-500 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Match Terms</h3>
            <p className="text-sm text-gray-600">Drag & drop concepts</p>
          </div>
          <div className="p-4 border-2 border-pink-200 bg-pink-50 rounded-xl cursor-pointer hover:shadow-md transition-all" onClick={() => generateQuiz('Banking and scholarship portal memory', 'intermediate')}>
            <Trophy className="w-8 h-8 text-pink-500 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Memory Puzzle</h3>
            <p className="text-sm text-gray-600">Match icons & terms</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6" /> My Badge Collection
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {userBadges.length > 0 ? userBadges.map((badge) => (
            <div key={badge.id} className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl text-center">
              <div className="text-2xl mb-1">{badge.icon}</div>
              <h4 className="font-semibold text-sm text-gray-900">{badge.name}</h4>
              <p className="text-xs text-gray-600">{badge.description}</p>
            </div>
          )) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Complete quizzes to earn badges!</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6" /> Leaderboard & Social Motivation
        </h2>
        <div className="space-y-3">
          {leaderboard.slice(0, 5).map((user, index) => (
            <div key={user.id} className={`flex items-center justify-between p-3 rounded-xl ${
              user.name === 'You' ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-yellow-500' : 'bg-gray-400'
                }`}>
                  {user.rank}
                </div>
                <span className="font-semibold">{user.name}</span>
                {user.name === 'You' && userStats.level >= 2 && <span className="text-sm bg-yellow-100 px-2 py-1 rounded-full">DBT Agent</span>}
              </div>
              <span className={`font-bold ${
                user.name === 'You' ? 'text-yellow-600' : 'text-gray-600'
              }`}>{user.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => {
    if (loading) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Questions are being framed, wait a sec...</p>
          </div>
        </div>
      );
    }

    if (showResults) {
      const correctAnswers = userAnswers.filter(
        (answer, index) => answer === questions[index].correctAnswer
      ).length;
      const earnedPoints = correctAnswers * 10;

      return (
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quest Complete!</h1>
          <p className="text-xl text-gray-600 mb-6">
            You scored {correctAnswers} out of {questions.length}
          </p>
          <div className="bg-indigo-50 rounded-xl p-6 mb-6">
            <p className="text-lg font-semibold text-indigo-900">
              Points Earned: +{earnedPoints}
            </p>
            <p className="text-indigo-700">
              Total Points: {userStats.points}
            </p>
          </div>
          <button
            onClick={resetQuiz}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }

    if (questions.length === 0) return null;

    const question = questions[currentQuestion];
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-indigo-900">{currentQuiz.title}</h1>
            <button onClick={resetQuiz} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>
          <div className="space-y-4">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const isWrong = isSelected && !isCorrect;
              
              return (
                <button
                  key={index}
                  onClick={() => !showExplanation && handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all flex items-center justify-between ${
                    showExplanation
                      ? isCorrect
                        ? "border-green-500 bg-green-50"
                        : isWrong
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                      : isSelected
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <span>
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </span>
                  {showExplanation && isCorrect && <CheckCircle className="w-6 h-6 text-green-500" />}
                  {showExplanation && isWrong && <X className="w-6 h-6 text-red-500" />}
                </button>
              );
            })}
          </div>
          
          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Explanation</h3>
                  <p className="text-blue-800">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}
          
          {!showExplanation && selectedAnswer !== null && (
            <button
              onClick={submitAnswer}
              disabled={submitting}
              className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating Response...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Answer
                </>
              )}
            </button>
          )}
          
          {showExplanation && (
            <button
              onClick={handleNextQuestion}
              className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700"
            >
              {currentQuestion === questions.length - 1 ? "Finish Quest" : "Next Question"}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-900 mb-2">
            🎮 LearnQuest - DBT Readiness Hub
          </h1>
          <p className="text-indigo-700 text-base sm:text-lg">
            Become an Agent of Digital Inclusion
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-900">{userStats.points}</h3>
            <p className="text-gray-600">Total Points</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <Target className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-900">Level {userStats.level}</h3>
            <p className="text-gray-600">Agent Level</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-900">{userStats.badges}</h3>
            <p className="text-gray-600">Badges Earned</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-900">{userStats.dbtReady}%</h3>
            <p className="text-gray-600">DBT Ready</p>
          </div>
        </div>

        {selectedSection === 'dashboard' && renderDashboard()}
        {selectedSection === 'quiz' && renderQuiz()}
        
        {/* Congratulations Modal */}
        {showCongrats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Congratulations!</h2>
              <p className="text-gray-600 mb-4">Great job on scoring above 70%!</p>
              {newBadge && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-4">
                  <div className="text-3xl mb-2">{newBadge.icon}</div>
                  <h3 className="font-bold text-gray-900">{newBadge.name}</h3>
                  <p className="text-sm text-gray-600">{newBadge.description}</p>
                </div>
              )}
              <button
                onClick={() => setShowCongrats(false)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700"
              >
                Continue Learning
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}