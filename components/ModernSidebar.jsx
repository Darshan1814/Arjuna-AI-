"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { 
  Brain, 
  Home,
  ChevronLeft,
  ChevronRight,
  Trophy,
  BarChart3,
  MessageCircle
} from "lucide-react";

export default function ModernSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainLinks = [
    { 
      href: "/dashboard", 
      label: "Dashboard", 
      icon: Home,
      description: "DBT vs Aadhaar Overview"
    },
    { 
      href: "/consultation", 
      label: "Consult Yantra", 
      icon: Brain,
      description: "DBT Account Guidance"
    },
    { 
      href: "/game-with-yantra", 
      label: "Game with Yantra", 
      icon: MessageCircle,
      description: "Interactive DBT Learning"
    },
    { 
      href: "/learn-quest", 
      label: "LearnQuest", 
      icon: Trophy,
      description: "DBT Awareness Games"
    },
    { 
      href: "/progress", 
      label: "DBT Setup", 
      icon: BarChart3,
      description: "DBT Setup Progress"
    }
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col fixed top-0 left-0 z-40 lg:relative lg:translate-x-0`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-gray-600" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-gray-600" />
        )}
      </button>

      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
            <img src="/yantra.png" alt="Yantra" className="w-6 h-6 rounded-full" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">
                Arjuna AI
              </h1>
              <p className="text-xs text-gray-500">Healthcare & DBT Platform with AVR</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        <div className={`${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Main Menu
            </h3>
          )}
          
          {mainLinks.map(({ href, label, icon: Icon, description }) => {
            const isActive = pathname === href;
            
            return (
              <Link
                key={href}
                href={href}
                className={`group relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1">
                    <p className="font-medium">{label}</p>
                    <p className={`text-xs ${isActive ? 'text-emerald-100' : 'text-gray-500'}`}>
                      {description}
                    </p>
                  </div>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}