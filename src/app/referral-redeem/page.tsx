"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReferralRedeemPage() {
  const router = useRouter();
  const [referralInput, setReferralInput] = useState("");
  const [message, setMessage] = useState("");

  const handleRedeem = () => {
    // Simulate validation: valid referral codes are exactly 6 characters long
    if (referralInput.trim().length === 6) {
      setMessage("Thank you for choosing us!");
    } else {
      setMessage("Invalid referral code. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black p-6">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Redeem Referral Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input 
              type="text" 
              placeholder="Enter referral code" 
              value={referralInput} 
              onChange={(e) => setReferralInput(e.target.value)} 
            />
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={handleRedeem}
            >
              Redeem
            </Button>
            {message && <p className="text-center text-lg">{message}</p>}
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
