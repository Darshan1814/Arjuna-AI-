"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function ModernDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 overflow-x-hidden">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <img src="/yantra.png" alt="Arjuna AI" className="w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-lg" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-900 px-2">
            Welcome to Arjuna AI 🤖
          </h1>
          <p className="text-indigo-700 mt-2 text-sm sm:text-base lg:text-lg px-4 sm:px-2">
            Your intelligent assistant for DBT banking and scholarship guidance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Yantra Consultation CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white text-center shadow-2xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-white/20 rounded-full flex items-center justify-center">
            <img src="/yantra.png" alt="Yantra" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 px-2">
            Start Your DBT Banking Journey
          </h2>
          <p className="text-indigo-100 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4 sm:px-2">
            Get expert guidance on DBT accounts, scholarship disbursement, and Aadhaar seeding from Yantra AI.
          </p>
          <button
            onClick={() => router.push('/consultation')}
            className="bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-indigo-50 transition-all transform hover:scale-105 flex items-center gap-2 sm:gap-3 mx-auto text-base sm:text-lg shadow-lg"
          >
            <img src="/yantra.png" alt="Yantra" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />
            Consult Yantra AI
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">🎤</span>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">AVR Audio Assistant</h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600">Voice-guided DBT assistance with audio virtual reality.</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => router.push('/learn-quest')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">🎮</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">LearnQuest</h3>
            <p className="text-sm sm:text-base text-gray-600">Learn through interactive games and earn rewards.</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => router.push('/progress')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">🆔</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Aadhaar Seeding</h3>
            <p className="text-sm sm:text-base text-gray-600">Step-by-step guide to seed your Aadhaar with your bank account.</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => router.push('/game-with-yantra')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">🎓</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Game with Yantra</h3>
            <p className="text-sm sm:text-base text-gray-600">Interactive DBT learning with AI companion.</p>
          </div>
        </div>
      </div>
    </div>
  );
}