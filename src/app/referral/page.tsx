"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function ReferralPage() {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check for an existing referral code in localStorage
    const code = localStorage.getItem("referralCode");
    if (code) {
      setReferralCode(code);
    } else {
      // Generate a new 6-character code
      const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      localStorage.setItem("referralCode", generatedCode);
      setReferralCode(generatedCode);
    }
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = "Join me on B-Ride!";
    const body = `Hey! I've been using B-Ride for my rides around campus and thought you might like it too. Use my referral code ${referralCode} to get a discount on your first ride! Sign up at b-ride.com`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareViaText = () => {
    const message = `Hey! Join me on B-Ride and use my referral code ${referralCode} to get a discount on your first ride! Sign up at b-ride.com`;
    if (navigator.share) {
      navigator.share({
        title: "Join me on B-Ride!",
        text: message,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      window.location.href = `sms:?body=${encodeURIComponent(message)}`;
    }
  };

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
            Refer a Friend
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-[#4D9FFF]/20 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D9FFF]">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Share B-Ride with Friends</h2>
              <p className="text-gray-600 mb-6">
                Invite friends to join B-Ride and you'll both get a discount on your next ride!
              </p>
            </div>

            <div className="bg-[#F0F7FF] p-6 rounded-xl border border-[#D0E3FF]">
              <p className="text-center font-medium text-gray-700 mb-3">Your Unique Referral Code</p>
              <div className="flex items-center justify-center gap-3">
                <div className="px-6 py-3 bg-white rounded-lg border border-gray-200 font-mono text-xl tracking-wider text-[#4D9FFF] font-semibold">
                  {referralCode}
                </div>
                <Button
                  className={`${copied ? 'bg-green-500' : 'bg-[#4D9FFF]'} hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition-colors`}
                  onClick={copyCode}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/30 p-5 rounded-xl border border-white/20 hover:shadow-md transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-[#E6B400]/10 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E6B400]">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Share via Email</h3>
                  <p className="text-gray-600 text-sm mb-3">Send an invitation email to your friends</p>
                  <Button
                    onClick={shareViaEmail}
                    className="bg-[#E6B400] hover:bg-[#D9A900] text-black font-medium px-4 py-2 rounded-full text-sm"
                  >
                    Send Email
                  </Button>
                </div>
              </div>
              
              <div className="bg-white/30 p-5 rounded-xl border border-white/20 hover:shadow-md transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-[#4D9FFF]/10 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D9FFF]">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Share via Text</h3>
                  <p className="text-gray-600 text-sm mb-3">Send a text message with your code</p>
                  <Button
                    onClick={shareViaText}
                    className="bg-[#4D9FFF] hover:bg-[#3D8FEF] text-white font-medium px-4 py-2 rounded-full text-sm"
                  >
                    Send Text
                  </Button>
                </div>
              </div>
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
                  <h4 className="font-medium text-yellow-800">How It Works</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    When your friend signs up using your referral code, you'll both receive a $5 credit toward your next ride. There's no limit to how many friends you can refer!
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
