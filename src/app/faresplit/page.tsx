"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function FareSplitPage() {
  const [totalFare, setTotalFare] = useState<number>(0);
  const [riders, setRiders] = useState<string[]>([""]);
  const [splits, setSplits] = useState<number[]>([]);
  const [customSplit, setCustomSplit] = useState<boolean>(false);
  const router = useRouter();
 
  const handleSplit = () => {
    if (!customSplit) {
      const evenSplit = totalFare / riders.length;
      setSplits(Array(riders.length).fill(evenSplit));
    }
  };

  const updateSplit = (index: number, value: number) => {
    const newSplits = [...splits];
    newSplits[index] = value;
    setSplits(newSplits);
  };

  const addRider = () => {
    setRiders([...riders, ""]);
    setSplits([...splits, 0]);
  };

  const removeRider = (index: number) => {
    const newRiders = riders.filter((_, i) => i !== index);
    const newSplits = splits.filter((_, i) => i !== index);
    setRiders(newRiders);
    setSplits(newSplits);
  };

  // Calculate total of custom splits
  const customTotal = splits.reduce((sum, amount) => sum + (isNaN(amount) ? 0 : amount), 0);
  const remaining = totalFare - customTotal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] to-[#020B3B] p-6">
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Split Your Fare</h1>
          <p className="text-blue-200">Share the cost with your friends easily</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden mb-6">
          <CardHeader className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white">
            <CardTitle className="text-center text-2xl font-bold">Fare Splitting Tool</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Fare Amount</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={totalFare || ""}
                    onChange={(e) => setTotalFare(parseFloat(e.target.value) || 0)}
                    className="border-blue-200 focus:ring-blue-500 rounded-md pl-8"
                    placeholder="Enter total fare amount"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Riders</label>
                  <button 
                    onClick={addRider} 
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Rider
                  </button>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                  {riders.map((rider, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder={`Rider ${index + 1} Name`}
                          value={rider}
                          onChange={(e) => {
                            const newRiders = [...riders];
                            newRiders[index] = e.target.value;
                            setRiders(newRiders);
                          }}
                          className="border-blue-200 focus:ring-blue-500 rounded-md"
                        />
                      </div>
                      {customSplit && (
                        <div className="w-24 relative">
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={splits[index] || ""}
                            onChange={(e) => updateSplit(index, parseFloat(e.target.value) || 0)}
                            className="border-blue-200 focus:ring-blue-500 rounded-md pl-6"
                          />
                          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <span className="text-gray-500">$</span>
                          </div>
                        </div>
                      )}
                      {index > 0 && (
                        <button 
                          onClick={() => removeRider(index)} 
                          className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="customSplit" 
                  checked={customSplit} 
                  onChange={() => setCustomSplit(!customSplit)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="customSplit" className="text-sm font-medium text-gray-700">
                  Custom Split (manually enter amounts)
                </label>
              </div>

              {customSplit && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-800">Total fare: ${totalFare.toFixed(2)}</span>
                    <span className="text-yellow-800">Allocated: ${customTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className={remaining === 0 ? "text-green-600" : "text-red-600"}>
                      {remaining === 0 ? "Perfectly split!" : `Remaining: $${remaining.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleSplit}
                disabled={customSplit}
                className={`w-full py-2 text-sm font-medium transition-all rounded-full shadow-md flex items-center justify-center gap-2 ${
                  customSplit 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-gradient-to-r from-[#0F172A] to-[#1E40AF] hover:from-[#172554] hover:to-[#2563EB] text-white"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                </svg>
                Split Evenly
              </button>

              {splits.length > 0 && splits.some(s => !isNaN(s) && s > 0) && (
                <div className="mt-4 bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Split Results</h3>
                  <div className="space-y-2">
                    {riders.map((rider, index) => (
                      <div key={index} className="flex justify-between items-center py-1 border-b border-blue-100 last:border-0">
                        <span className="text-gray-700">{rider || `Rider ${index + 1}`}</span>
                        <span className="font-semibold text-blue-900">${splits[index]?.toFixed(2) || "0.00"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-1.5 bg-gradient-to-r from-[#172554] to-[#2563eb] text-white shadow-md rounded-full flex items-center gap-2"
            onClick={() => router.push("/ride-cost")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Cost Estimation
          </button>
          
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
