"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function DarkModeToggle() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage for theme preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#2563EB] to-[#020B3B] p-6">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Display Settings</h1>
          <p className="text-blue-200">Customize your B-Ride experience</p>
        </div>
        
        <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white">
            <CardTitle className="text-center text-2xl font-bold">Lighting Mode</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex justify-center w-full gap-6">
                <div className={`w-32 h-32 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all ${!isDark ? 'ring-4 ring-blue-500 shadow-lg scale-105' : 'opacity-70'}`} 
                     style={{background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)'}}
                     onClick={() => {
                       if (isDark) toggleDarkMode();
                     }}>
                  <div className="w-12 h-12 bg-yellow-400 rounded-full mb-2 shadow-md"></div>
                  <span className="text-sm font-medium text-gray-800">Light Mode</span>
                </div>
                
                <div className={`w-32 h-32 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all ${isDark ? 'ring-4 ring-blue-500 shadow-lg scale-105' : 'opacity-70'}`}
                     style={{background: 'linear-gradient(to bottom right, #1e293b, #0f172a)'}}
                     onClick={() => {
                       if (!isDark) toggleDarkMode();
                     }}>
                  <div className="w-12 h-12 bg-gray-300 rounded-full mb-2 shadow-md" style={{boxShadow: '0 0 10px 2px rgba(255,255,255,0.2)'}}>
                    <div className="w-10 h-10 bg-gray-800 rounded-full transform translate-x-1 translate-y-1"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-200">Dark Mode</span>
                </div>
              </div>
              
              <p className="text-center text-gray-600 text-sm">
                {isDark 
                  ? "Dark mode reduces eye strain in low light environments and saves battery life." 
                  : "Light mode provides better readability in bright environments."}
              </p>
              
              <button
                onClick={toggleDarkMode}
                className="w-full bg-gradient-to-r from-[#0F172A] to-[#1E40AF] hover:from-[#172554] hover:to-[#2563EB] text-white shadow-md rounded-full py-2 text-sm font-medium transition-all"
              >
                Switch to {isDark ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 flex justify-center">
          <button
            className="px-6 py-1.5 bg-gradient-to-r from-[#172554] to-[#2563eb] text-white shadow-md rounded-full flex items-center gap-2"
            onClick={() => router.push("/dashboard")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
