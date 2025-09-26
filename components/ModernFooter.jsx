"use client";

import Link from "next/link";
import { 
  Shield, 
  Brain,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";

export default function ModernFooter() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Linkedin, label: "LinkedIn" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Main Content */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Brand & Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <img src="/yantra.png" alt="Arjuna AI" className="w-5 h-5 rounded-full" />
            </div>
            <div>
              <h3 className="font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Arjuna AI
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>© {currentYear}</span>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>DBT Awareness Portal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className="w-7 h-7 bg-gray-700 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-4 p-3 bg-indigo-900/20 border border-indigo-800/30 rounded-lg">
          <p className="text-indigo-300 text-xs text-center leading-relaxed">
            <strong>Our Mission:</strong> Enhancing Student Awareness on difference between Aadhaar linked and Direct Beneficiary Transfer (DBT) enabled Aadhaar seeded bank account
          </p>
        </div>
        
        {/* Designer Credit */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-700/30 rounded-lg p-3">
            <p className="text-center text-xs text-emerald-300">
              <span className="font-medium">Designed by </span>
              <span className="font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Arjuna_03
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-300">Crafted for </span>
              <span className="font-semibold text-emerald-400">Ministry of Social Justice & Empowerment (MoSJE)</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}