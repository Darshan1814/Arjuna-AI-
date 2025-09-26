"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Circle, ExternalLink, FileText, CreditCard, BarChart3, RotateCcw, User, ArrowLeft } from "lucide-react";

export default function ProgressTracker() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    otr: { completed: 0, total: 8 },
    application: { completed: 0, total: 6 },
    seeding: { completed: 0, total: 5 },
    tracking: { completed: 0, total: 4 },
    renewal: { completed: 0, total: 5 }
  });

  const [tasks, setTasks] = useState({
    otr: [
      { id: 1, title: "Visit NSP Portal", completed: false, link: "https://scholarships.gov.in" },
      { id: 2, title: "Click New Registration", completed: false },
      { id: 3, title: "Read Guidelines", completed: false },
      { id: 4, title: "Enter Mobile Number & OTP", completed: false },
      { id: 5, title: "Complete eKYC Verification", completed: false },
      { id: 6, title: "Fill Personal Details", completed: false },
      { id: 7, title: "Provide Bank Details", completed: false },
      { id: 8, title: "Complete Face Authentication & Submit", completed: false }
    ],
    application: [
      { id: 1, title: "Log in with OTR ID", completed: false, link: "https://scholarships.gov.in" },
      { id: 2, title: "Select Scholarship Scheme", completed: false },
      { id: 3, title: "Fill Application Form", completed: false },
      { id: 4, title: "Upload Required Documents", completed: false },
      { id: 5, title: "Final Submit Application", completed: false },
      { id: 6, title: "Download Acknowledgment", completed: false }
    ],
    seeding: [
      { id: 1, title: "Visit Bank Branch", completed: false },
      { id: 2, title: "Submit Aadhaar Seeding Consent Form", completed: false },
      { id: 3, title: "Provide Required Documents", completed: false },
      { id: 4, title: "Complete Bank Verification", completed: false },
      { id: 5, title: "Get Confirmation Receipt", completed: false }
    ],
    tracking: [
      { id: 1, title: "Log in to NSP Portal", completed: false, link: "https://scholarships.gov.in" },
      { id: 2, title: "Navigate to Track Application Status", completed: false },
      { id: 3, title: "Enter Application ID", completed: false },
      { id: 4, title: "View Current Status", completed: false }
    ],
    renewal: [
      { id: 1, title: "Log in with OTR ID", completed: false, link: "https://scholarships.gov.in" },
      { id: 2, title: "Navigate to Renewal Section", completed: false },
      { id: 3, title: "Update Required Details", completed: false },
      { id: 4, title: "Upload Documents", completed: false },
      { id: 5, title: "Final Submit & Download Receipt", completed: false }
    ]
  });

  const sections = [
    {
      key: 'otr',
      title: '📝 One-Time Registration (OTR)',
      icon: <User className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'Complete your unique registration for NSP scholarships'
    },
    {
      key: 'application',
      title: '🧾 Scholarship Application',
      icon: <FileText className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      description: 'Apply for specific scholarship schemes'
    },
    {
      key: 'seeding',
      title: '💳 Aadhaar Seeding',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      description: 'Link Aadhaar with bank account for DBT'
    },
    {
      key: 'tracking',
      title: '📊 Track Application',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      description: 'Monitor your application progress'
    },
    {
      key: 'renewal',
      title: '🔄 Scholarship Renewal',
      icon: <RotateCcw className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500',
      description: 'Continue receiving scholarships'
    }
  ];

  const selectSection = (sectionKey) => {
    setSelectedSection(sectionKey);
  };

  const toggleTask = (taskId) => {
    setTasks(prev => ({
      ...prev,
      [selectedSection]: prev[selectedSection].map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  useEffect(() => {
    const newProgress = {};
    Object.keys(tasks).forEach(section => {
      const completed = tasks[section].filter(task => task.completed).length;
      const total = tasks[section].length;
      newProgress[section] = { completed, total };
    });
    setProgress(newProgress);
  }, [tasks]);

  const currentSection = sections.find(s => s.key === selectedSection);
  const currentProgress = selectedSection ? progress[selectedSection] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 -m-4 lg:-m-6">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-900 mb-2">
            📋 DBT Setup Tracker
          </h1>
          <p className="text-indigo-700 text-base sm:text-lg">
            Choose a process to track your DBT setup progress
          </p>
        </div>

        {!selectedSection ? (
          /* Section Selection Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {sections.map((section) => (
              <div 
                key={section.key} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
                onClick={() => selectSection(section.key)}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto`}>
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{section.title}</h3>
                <p className="text-gray-600 text-center mb-4">{section.description}</p>
                <div className="text-center">
                  <span className="text-sm font-medium text-indigo-600">
                    {progress[section.key].completed}/{progress[section.key].total} completed
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`bg-gradient-to-r ${section.color} h-2 rounded-full transition-all`}
                      style={{ width: `${Math.round((progress[section.key].completed / progress[section.key].total) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Selected Section Tasks */
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setSelectedSection(null)}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <ArrowLeft className="w-5 h-5" /> Back to Sections
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${currentSection.color} rounded-xl flex items-center justify-center text-white`}>
                  {currentSection.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
                  <p className="text-gray-600">{currentSection.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">
                    {currentProgress.completed}/{currentProgress.total}
                  </div>
                  <div className="text-sm text-gray-600">
                    {Math.round((currentProgress.completed / currentProgress.total) * 100)}% Complete
                  </div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div 
                  className={`bg-gradient-to-r ${currentSection.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${Math.round((currentProgress.completed / currentProgress.total) * 100)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                {tasks[selectedSection].map((task) => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      task.completed 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50 hover:border-indigo-300'
                    }`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className="flex items-center gap-3">
                      {task.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                      <span className={`font-medium ${task.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </span>
                    </div>
                    {task.link && (
                      <a 
                        href={task.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}