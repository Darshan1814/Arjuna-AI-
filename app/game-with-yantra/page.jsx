"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Lightbulb, RefreshCw, Send, X } from "lucide-react";
import Vapi from '@vapi-ai/web';

export default function GameWithYantra() {
  const [gameQuestion, setGameQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const vapiRef = useRef(null);

  useEffect(() => {
    generateNewQuestion();
    initializeVapi();
  }, []);

  const initializeVapi = async () => {
    try {
      const publicKey = '40e7ab26-af43-4e5f-a7e3-6db1e781bdc9';
      if (!publicKey) {
        console.warn('Vapi not configured - voice features disabled');
        return;
      }

      vapiRef.current = new Vapi(publicKey);
      
      vapiRef.current.on('call-start', () => {
        setIsConnecting(false);
        setIsCallActive(true);
      });
      
      vapiRef.current.on('call-end', () => {
        setIsConnecting(false);
        setIsCallActive(false);
      });
      
      vapiRef.current.on('error', (error) => {
        console.error('Vapi error:', error);
        setIsConnecting(false);
        setIsCallActive(false);
      });

    } catch (error) {
      console.error('Vapi initialization failed:', error);
    }
  };

  const generateNewQuestion = async () => {
    setLoading(true);
    setSelectedAnswer(null);
    setShowResult(false);
    try {
      const response = await fetch('/api/game-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setGameQuestion(data);
    } catch (error) {
      console.error('Failed to generate question:', error);
    }
    setLoading(false);
  };

  const startVoiceDiscussion = async () => {
    try {
      const assistantId = '61ee6ff1-52e2-41e6-82d5-dfdcf0ed7a25';
      if (!assistantId || !vapiRef.current) {
        console.warn('Vapi not configured - voice chat disabled');
        return;
      }
      
      if (isCallActive) {
        await vapiRef.current.stop();
      } else {
        setIsConnecting(true);
        await vapiRef.current.start(assistantId);
      }
    } catch (error) {
      console.error('Failed to start voice chat:', error);
      setIsConnecting(false);
      setIsCallActive(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-900 mb-2">
            🎮 Game with Yantra
          </h1>
          <p className="text-indigo-700 text-base sm:text-lg">
            Interactive learning with your AI companion
          </p>
        </div>

        {/* Game Question Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg mb-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating new challenge...</p>
            </div>
          ) : gameQuestion ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    gameQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    gameQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {gameQuestion.difficulty}
                  </div>
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {gameQuestion.category}
                  </div>
                </div>
                <button
                  onClick={generateNewQuestion}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <RefreshCw className="w-4 h-4" /> New Question
                </button>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {gameQuestion.question}
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Scenario:</h3>
                <p className="text-blue-800">{gameQuestion.scenario}</p>
              </div>

              {/* MCQ Options */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Choose your answer:</h3>
                <div className="space-y-3">
                  {gameQuestion.options?.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = showResult && index === gameQuestion.correctAnswer;
                    const isWrong = showResult && isSelected && index !== gameQuestion.correctAnswer;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => !showResult && setSelectedAnswer(index)}
                        disabled={showResult}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all flex items-center justify-between ${
                          showResult
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
                        {showResult && isCorrect && <span className="text-green-600 font-bold">✓</span>}
                        {showResult && isWrong && <span className="text-red-600 font-bold">✗</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Show explanation after submission */}
              {showResult && gameQuestion.explanation && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-2">Explanation:</h3>
                  <p className="text-blue-800">{gameQuestion.explanation}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" /> Hints
                  </h3>
                  <div className="space-y-2">
                    {gameQuestion.hints?.map((hint, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">{hint}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {gameQuestion.relatedTopics?.map((topic, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                {!showResult && selectedAnswer !== null && (
                  <button
                    onClick={() => setShowResult(true)}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 flex items-center gap-2 mx-auto"
                  >
                    Submit Answer
                  </button>
                )}
                
                <button
                  onClick={startVoiceDiscussion}
                  className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-all duration-300 ${
                    isConnecting 
                      ? 'bg-yellow-500 animate-spin' 
                      : isCallActive 
                      ? 'bg-green-500 hover:bg-green-600 animate-pulse' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white`}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : isCallActive ? (
                    <img src="/yantra.png" alt="Yantra" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <img src="/yantra.png" alt="Yantra" className="w-5 h-5 rounded-full object-cover opacity-80" />
                  )}
                  {isConnecting ? 'Connecting to Yantra...' : isCallActive ? 'End Call with Yantra' : 'Call Yantra to Discuss'}
                </button>
                
                {isCallActive && (
                  <p className="text-sm text-green-600 mt-2 font-medium text-center">
                    🎙️ Voice call active - Yantra is listening!
                  </p>
                )}
                
                {isConnecting && (
                  <p className="text-sm text-yellow-600 mt-2 font-medium text-center">
                    ⏳ Connecting to Yantra...
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>


      </div>
    </div>
  );
}