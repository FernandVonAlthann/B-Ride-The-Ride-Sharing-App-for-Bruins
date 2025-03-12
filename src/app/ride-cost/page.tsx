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
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateCost = () => {
    // Convert inputs to numbers
    const miles = parseFloat(distance);
    const minutes = parseFloat(duration);

    if (isNaN(miles) || isNaN(minutes)) {
      alert("Please enter valid numbers for distance and duration.");
      return;
    }

    setIsCalculating(true);
    
    // Simulate a calculation delay for better UX
    setTimeout(() => {
      // Pricing example: base fare = $3.00, cost per mile = $1.50, cost per minute = $0.25
      const baseFare = 3;
      const costPerMile = 1.5;
      const costPerMinute = 0.25;
      const cost = baseFare + (miles * costPerMile) + (minutes * costPerMinute);
      setEstimatedCost(cost);
      setIsCalculating(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] to-[#020B3B] p-6">
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Ride Cost Estimation</h1>
          <p className="text-blue-200">Calculate the cost of your ride before you book</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden mb-6">
          <CardHeader className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white">
            <CardTitle className="text-center text-2xl font-bold">Estimate Your Fare</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter distance"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="border-blue-200 focus:ring-blue-500 rounded-md pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                    miles
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="border-blue-200 focus:ring-blue-500 rounded-md pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                    minutes
                  </div>
                </div>
              </div>
              
              <button
                className="w-full bg-gradient-to-r from-[#0F172A] to-[#1E40AF] hover:from-[#172554] hover:to-[#2563EB] text-white shadow-md rounded-full py-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
                onClick={calculateCost}
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Estimate Cost
                  </>
                )}
              </button>
            </div>
            
            {estimatedCost !== null && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Fare Estimate</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm">Base fare</p>
                    <p className="text-gray-600 text-sm">Distance charge ({distance} miles)</p>
                    <p className="text-gray-600 text-sm">Time charge ({duration} minutes)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">$3.00</p>
                    <p className="text-gray-600 text-sm">${(parseFloat(distance) * 1.5).toFixed(2)}</p>
                    <p className="text-gray-600 text-sm">${(parseFloat(duration) * 0.25).toFixed(2)}</p>
                  </div>
                </div>
                <div className="border-t border-blue-100 mt-2 pt-2 flex justify-between items-center">
                  <p className="font-bold text-blue-900">Total Estimated Cost</p>
                  <p className="font-bold text-2xl text-blue-900">${estimatedCost.toFixed(2)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-center gap-4">
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
          
          <button
            className="px-6 py-1.5 bg-gradient-to-r from-[#172554] to-[#2563eb] text-white shadow-md rounded-full flex items-center gap-2"
            onClick={() => router.push("/faresplit")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Split Fare
          </button>
        </div>
      </div>
    </div>
  );
}

