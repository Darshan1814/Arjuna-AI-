"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { usePathname } from "next/navigation";
import Vapi from '@vapi-ai/web';

export default function FloatingYantra() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isListening, setIsListening] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [vapi, setVapi] = useState(null);
  const dragRef = useRef(null);

  useEffect(() => {
    // Initialize position based on screen size
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      setPosition({ 
        x: window.innerWidth - (isMobile ? 80 : 100), 
        y: window.innerHeight - (isMobile ? 80 : 100)
      });
    }

    // Initialize Vapi like consultation page
    const initializeVapi = async () => {
      try {
        const publicKey = '40e7ab26-af43-4e5f-a7e3-6db1e781bdc9';
        if (!publicKey) {
          console.warn('Vapi not configured - voice features disabled');
          return;
        }

        setVapi(new Vapi(publicKey));
      } catch (error) {
        console.error('Vapi initialization failed:', error);
      }
    };
    
    initializeVapi();

    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const isMobile = window.innerWidth < 768;
        const offset = isMobile ? 60 : 80;
        setPosition(prev => ({
          x: Math.min(prev.x, window.innerWidth - offset),
          y: Math.min(prev.y, window.innerHeight - offset)
        }));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging && typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 60 : 80;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - offset, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - offset, e.clientY - dragOffset.y))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const pathname = usePathname();
  
  const startVoiceChat = async () => {
    const assistantId = pathname === '/game-with-yantra' 
      ? '61ee6ff1-52e2-41e6-82d5-dfdcf0ed7a25' // Game assistant
      : '61ee6ff1-52e2-41e6-82d5-dfdcf0ed7a25'; // Same for now
    
    if (!vapi) {
      console.warn('Vapi not initialized');
      return;
    }

    try {
      if (isListening) {
        await vapi.stop();
      } else {
        setIsConnecting(true);
        
        vapi.on('call-start', () => {
          setIsConnecting(false);
          setIsListening(true);
        });
        vapi.on('call-end', () => {
          setIsConnecting(false);
          setIsListening(false);
        });
        vapi.on('error', (error) => {
          console.error('Vapi error:', error);
          setIsConnecting(false);
          setIsListening(false);
        });
        
        await vapi.start(assistantId);
      }
    } catch (error) {
      console.error('Vapi call failed:', error);
      setIsConnecting(false);
      setIsListening(false);
    }
  };

  return (
    <div
      ref={dragRef}
      className="fixed z-50 cursor-move"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center cursor-pointer ${
          isConnecting
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 animate-spin'
            : isListening 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse' 
            : 'bg-gradient-to-r from-indigo-500 to-purple-500'
        }`}
        onClick={!isDragging ? startVoiceChat : undefined}
      >
        <img src="/yantra.png" alt="Yantra" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full" />
      </div>
      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-red-500 rounded-full flex items-center justify-center">
        {isListening ? (
          <Mic className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white" />
        ) : (
          <MicOff className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white" />
        )}
      </div>
      
      {/* Status indicator */}
      {isConnecting && (
        <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-600 bg-opacity-90 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs whitespace-nowrap">
          Connecting... ⏳
        </div>
      )}
      {isListening && !isConnecting && (
        <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 bg-opacity-90 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs whitespace-nowrap">
          I'm listening! 👂
        </div>
      )}
    </div>
  );
}