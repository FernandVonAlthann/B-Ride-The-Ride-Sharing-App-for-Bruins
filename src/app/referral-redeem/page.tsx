"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function ReferralRedeemPage() {
  const router = useRouter();
  const [referralInput, setReferralInput] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const handleRedeem = () => {
    // Simulate validation: valid referral codes are exactly 6 characters long
    if (referralInput.trim().length === 6) {
      setMessage("Referral code redeemed successfully! $5 credit has been added to your account.");
      setMessageType("success");
    } else {
      setMessage("Invalid referral code. Please try again.");
      setMessageType("error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRedeem();
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
            Redeem Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-[#E6B400]/20 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E6B400]">
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                    <path d="M18 12a2 2 0 0 0 0 4h2v-4Z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Got a Referral Code?</h2>
              <p className="text-gray-600 mb-6">
                Enter your friend's referral code below to receive $5 credit toward your next ride!
              </p>
            </div>

            <div className="bg-[#F0F7FF] p-6 rounded-xl border border-[#D0E3FF]">
              <p className="text-center font-medium text-gray-700 mb-3">Enter Referral Code</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Input 
                  type="text" 
                  placeholder="Enter 6-character code" 
                  value={referralInput} 
                  onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4D9FFF] text-center uppercase tracking-wider font-mono text-lg"
                  maxLength={6}
                />
                <Button 
                  className="bg-[#E6B400] hover:bg-[#D9A900] text-black font-semibold px-6 py-3 rounded-full sm:w-auto w-full"
                  onClick={handleRedeem}
                >
                  Redeem Code
                </Button>
              </div>
              
              {message && (
                <div className={`mt-4 p-3 rounded-lg text-center ${
                  messageType === "success" 
                    ? "bg-green-100 text-green-800 border border-green-200" 
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}>
                  <p>{message}</p>
                </div>
              )}
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
                    When you redeem a valid referral code, both you and the person who referred you will receive a $5 credit. This credit will be automatically applied to your next ride.
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

