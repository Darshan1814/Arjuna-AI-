"use client";

import { usePathname } from "next/navigation";
import ModernSidebar from "@/components/ModernSidebar";
import ModernFooter from "@/components/ModernFooter";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  const hideLayout = pathname === "/auth/login" || 
                    pathname === "/auth/register" || 
                    pathname === "/doctor/register" || 
                    pathname === "/doctor-register" || 
                    pathname === "/pharmacist-register";
  
  const showSidebar = !hideLayout;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {showSidebar && <ModernSidebar />}
      
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50">
          {children}
        </main>
        
        {!hideLayout && (
          <footer className="bg-white shadow-inner border-t border-blue-100">
            <ModernFooter />
          </footer>
        )}
      </div>
    </div>
  );
}