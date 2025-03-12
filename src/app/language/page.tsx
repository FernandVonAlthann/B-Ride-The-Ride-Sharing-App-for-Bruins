"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function LanguageSelection() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Fetch the stored language from the API on component mount.
    const fetchLanguage = async () => {
      try {
        const res = await fetch("/api/language", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch language preference");
        const data = await res.json();
        setLanguage(data.language || "en");
      } catch (error) {
        console.error("Error fetching language:", error);
      }
    };

    fetchLanguage();
  }, []);

  const handleChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    try {
      const res = await fetch("/api/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: newLanguage }),
      });
      if (!res.ok) throw new Error("Failed to update language preference");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating language:", error);
      alert("Error updating language preference");
    }
  };

  // Language options with flags and native names
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
    { code: "es", name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
    { code: "fr", name: "French", flag: "🇫🇷", nativeName: "Français" },
    { code: "de", name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
    { code: "zh", name: "Chinese", flag: "🇨🇳", nativeName: "中文" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] p-6 flex flex-col">
      {/* Back to Dashboard Button */}
      <Button 
        className="self-start mb-6 bg-[#172554] hover:bg-[#1E3A8A] text-white shadow-md rounded-full px-6 py-2 flex items-center gap-2"
        onClick={() => router.push("/dashboard")}
      >
        ← Back to Dashboard
      </Button>

      <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm text-gray-900 shadow-xl rounded-2xl border-t border-white/50">
        <CardHeader className="bg-gradient-to-r from-[#4D9FFF] to-[#2563EB] text-white rounded-t-2xl p-6">
          <CardTitle className="text-center text-2xl font-bold">
            Language Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-[#4D9FFF]/20 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D9FFF]">
                    <path d="m5 8 6 6" />
                    <path d="m4 14 6-6 2-3" />
                    <path d="M2 5h12" />
                    <path d="M7 2h1" />
                    <path d="m22 22-5-10-5 10" />
                    <path d="M14 18h6" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Select Your Language</h2>
              <p className="text-gray-600 mb-6">
                Choose your preferred language for the B-Ride app interface.
              </p>
            </div>

            {showSuccess && (
              <div className="bg-green-100 text-green-800 border border-green-200 p-3 rounded-lg text-center">
                Language updated successfully!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleChange(lang.code)}
                  className={`flex items-center p-4 rounded-xl border transition-all ${
                    language === lang.code
                      ? "bg-[#4D9FFF]/10 border-[#4D9FFF] shadow-sm"
                      : "bg-white/50 border-gray-200 hover:bg-[#4D9FFF]/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-label={`${lang.name} flag`}>
                      {lang.flag}
                    </span>
                    <div className="text-left">
                      <p className="font-medium">{lang.name}</p>
                      <p className="text-sm text-gray-500">{lang.nativeName}</p>
                    </div>
                  </div>
                  {language === lang.code && (
                    <div className="ml-auto">
                      <div className="w-5 h-5 bg-[#4D9FFF] rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="text-yellow-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800">Language Support</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Some features may not be fully translated in all languages. We're continuously working to improve our language support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
