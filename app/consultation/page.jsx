"use client";

import { useState, useRef, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { Mic, MicOff, Send, BookOpen, ExternalLink } from 'lucide-react';
import { vapiConfig } from '../../lib/vapiConfig';

export default function ConsultationPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am Yantra, your digital assistant for understanding Aadhaar and banking services. I can help you understand the difference between Aadhaar-linked and DBT-enabled bank accounts for scholarship disbursement. How can I assist you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const vapiRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeVapi();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeVapi = async () => {
    try {
      if (!vapiConfig.isConfigured()) {
        console.warn('Vapi not configured - voice features disabled');
        return;
      }

      vapiRef.current = new Vapi(vapiConfig.publicKey);
      
      vapiRef.current.on('error', (error) => {
        console.error('Vapi error:', error);
        setIsConnecting(false);
        setIsConnected(false);
        setIsListening(false);
      });
      
      vapiRef.current.on('call-start', () => {
        setIsConnecting(false);
        setIsConnected(true);
        setIsListening(true);
      });
      
      vapiRef.current.on('call-end', () => {
        setIsConnecting(false);
        setIsConnected(false);
        setIsListening(false);
      });
      
      vapiRef.current.on('speech-start', () => {
        setIsListening(true);
      });
      
      vapiRef.current.on('speech-end', () => {
        setIsListening(false);
        setIsProcessing(true);
      });
      
      vapiRef.current.on('message', (message) => {
        console.log('Vapi message:', message);
        if (message.type === 'transcript' && message.transcriptType === 'final') {
          console.log('Final transcript:', message.transcript);
          // Don't show user voice text in chat
        }
        
        if (message.type === 'function-call' || message.role === 'assistant') {
          console.log('Assistant response:', message);
          if (message.content && message.content !== 'Response received') {
            setChatMessages(prev => [...prev, {
              role: 'assistant',
              content: message.content
            }]);
          }
          setIsProcessing(false);
        }
      });

    } catch (error) {
      console.error('Vapi initialization failed:', error);
    }
  };

  const startVoiceChat = async () => {
    try {
      if (!vapiConfig.isConfigured() || !vapiRef.current) {
        console.warn('Vapi not configured - voice chat disabled');
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Voice chat is currently unavailable. Please use text chat instead.'
        }]);
        return;
      }
      
      setIsConnecting(true);
      await vapiRef.current.start(vapiConfig.assistantId);
    } catch (error) {
      console.error('Failed to start voice chat:', error);
      setIsConnecting(false);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Unable to start voice chat. Please try again or use text chat.'
      }]);
    }
  };

  const stopVoiceChat = async () => {
    try {
      if (vapiRef.current) {
        await vapiRef.current.stop();
      }
    } catch (error) {
      console.error('Failed to stop voice chat:', error);
    }
  };

  const sendTextMessage = async (messageToSend = null) => {
    const message = messageToSend || inputMessage;
    if (!message.trim() || isProcessing) return;
    
    const userMessage = message;
    setInputMessage('');
    setIsProcessing(true);
    
    // Show user message in chat
    setChatMessages(prev => [...prev, {
      role: 'user',
      content: userMessage
    }]);

    try {
      console.log('Sending to Gemini:', userMessage);
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [
            {
              role: 'system',
              content: 'You are Yantra, an empathetic and highly knowledgeable virtual assistant specialized in Aadhaar and DBT banking guidance for students.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ]
        })
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.reply && data.reply.trim()) {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply
        }]);
      } else if (data.error) {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I apologize, but I\'m having trouble connecting to my knowledge base. Please try again.'
        }]);
      } else {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I received your message but had trouble generating a response. Please try again.'
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.'
      }]);
    }
    
    setIsProcessing(false);
  };

  const quickQuestions = [
    "What is the difference between Aadhaar-linked and DBT-enabled bank accounts?",
    "My bank says account is Aadhaar-linked but scholarship not received, why?",
    "How do I seed my Aadhaar with my bank account for DBT enablement?",
    "What documents do I need for DBT activation at my bank?",
    "How to check if my account is DBT-enabled on the portal?"
  ];

  const handleQuickQuestion = (question) => {
    sendTextMessage(question);
  };

  const importantLinks = [
    {
      title: "DBT Portal",
      url: "https://dbtbharat.gov.in/",
      description: "Official DBT portal for checking account status"
    },
    {
      title: "UIDAI Portal",
      url: "https://uidai.gov.in/",
      description: "Aadhaar services and updates"
    },
    {
      title: "NSP Portal",
      url: "https://scholarships.gov.in/",
      description: "National Scholarship Portal"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative -m-4 lg:-m-6">
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3 sm:py-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <img src="/yantra.png" alt="Yantra" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">Yantra</h1>
                  <p className="text-xs sm:text-sm text-gray-600">DBT & Banking Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isConnected && (
                  <span className="text-xs sm:text-sm text-green-600 hidden sm:block">
                    Voice Active
                  </span>
                )}
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-[calc(100vh-160px)] sm:h-[calc(100vh-240px)]">
          
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:w-80 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Quick Questions
              </h3>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                Important Links
              </h3>
              <div className="space-y-3">
                {importantLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 border rounded hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900">{link.title}</div>
                    <div className="text-xs text-gray-600">{link.description}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 min-h-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm h-full flex flex-col relative overflow-hidden">
              {/* Yantra Background */}
              <div className="absolute inset-0 bg-[url('/yantra.png')] bg-contain bg-center bg-no-repeat opacity-10"></div>
              <div className="relative z-10 flex flex-col h-full">
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-full sm:max-w-lg px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm border ${
                      message.role === 'user' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white text-gray-900'
                    }`}>
                      <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-white shadow-sm border px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-indigo-600"></div>
                        <span className="text-xs sm:text-sm text-gray-900">Yantra is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} className="h-1" />
              </div>

              {/* Fixed Input Area */}
              <div className="border-t bg-white/95 p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    onClick={isConnected ? stopVoiceChat : startVoiceChat}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isConnecting 
                        ? 'bg-yellow-500 animate-spin' 
                        : isConnected 
                        ? 'bg-green-500 hover:bg-green-600 animate-pulse' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : isConnected ? (
                      <img src="/yantra.png" alt="Yantra" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover" />
                    ) : (
                      <img src="/yantra.png" alt="Yantra" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover opacity-80" />
                    )}
                  </button>
                  
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
                    placeholder="Ask about DBT accounts..."
                    className="flex-1 border border-gray-300 rounded-lg px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={isProcessing}
                  />
                  
                  <button
                    onClick={sendTextMessage}
                    disabled={!inputMessage.trim() || isProcessing}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                
                <div className="mt-2 text-xs text-gray-500 text-center px-2">
                  {isConnecting ? 'Connecting...' : 
                   isConnected ? 'Connected - Speak now' : 
                   'Click Yantra to start voice chat'}
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}