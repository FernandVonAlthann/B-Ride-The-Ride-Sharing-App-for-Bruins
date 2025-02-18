"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RideCostEstimation() {
  const router = useRouter();
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const calculateCost = () => {
    // Convert inputs to numbers
    const miles = parseFloat(distance);
    const minutes = parseFloat(duration);

    if (isNaN(miles) || isNaN(minutes)) {
      alert("Please enter valid numbers for distance and duration.");
      return;
    }

    // Pricing example: base fare = $3.00, cost per mile = $1.50, cost per minute = $0.25
    const baseFare = 3;
    const costPerMile = 1.5;
    const costPerMinute = 0.25;
    const cost = baseFare + (miles * costPerMile) + (minutes * costPerMinute);
    setEstimatedCost(cost);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black p-6">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Ride Cost Estimation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Distance (miles)"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={calculateCost}
            >
              Estimate Cost
            </Button>
            {estimatedCost !== null && (
              <p className="text-lg font-semibold">
                Estimated Cost: ${estimatedCost.toFixed(2)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <Button
        className="mt-6 bg-gray-500 hover:bg-gray-600 text-white"
        onClick={() => router.push("/dashboard")}
      >
        Back to Dashboard
      </Button>
       <Button
        className="mt-6 bg-gray-500 hover:bg-gray-600 text-white"
        onClick={() => router.push("/faresplit")}
      >
        Split Fare
      </Button>
    </div>
  );
}
