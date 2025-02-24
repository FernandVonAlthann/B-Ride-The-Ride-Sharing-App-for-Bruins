"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReferralPage() {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState("");

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
    alert("Referral code copied to clipboard!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Referral System</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-center">Share this code with your friends:</p>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <span className="px-4 py-2 bg-gray-200 rounded">{referralCode}</span>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={copyCode}>
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
      <Button
        onClick={() => router.push("/dashboard")}
        className="mt-6 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2"
      >
        Back to Dashboard
      </Button>
    </div>
  );
}
