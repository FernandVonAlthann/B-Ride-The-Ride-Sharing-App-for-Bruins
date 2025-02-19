"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReferralPage() {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const fetchReferralCode = async () => {
      try {
        const res = await fetch("http://localhost:5001/referral", { method: "GET", credentials: "include" });

        if (!res.ok) throw new Error("Failed to fetch referral code");

        const data = await res.json();
        setReferralCode(data.referralCode);
      } catch (error) {
        console.error("Error fetching referral code:", error);
      }
    };

    fetchReferralCode();
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
            <span className="px-4 py-2 bg-gray-200 rounded">{referralCode || "Loading..."}</span>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={copyCode} disabled={!referralCode}>
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

