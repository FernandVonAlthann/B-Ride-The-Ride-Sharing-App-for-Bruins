// app/ride-matching/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Ride {
  id: number;
  pickup_location: string;
  dropoff_location: string;
  created_at: string;
}

export default function RideMatching() {
  const router = useRouter();
  const [rides, setRides] = useState<Ride[]>([]);
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const [matchedRides, setMatchedRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRides = async (from = "", to = "") => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({ from, to });
      const res = await fetch(`/api/rides?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch rides");
      }
      const data = await res.json();
      setRides(data);
      setMatchedRides(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleSearch = () => {
    // Re-fetch rides with the applied filters
    fetchRides(fromFilter, toFilter);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] to-[#020B3B] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Find Matching Rides</h1>
          <p className="text-blue-200">Connect with other Bruins heading your way</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden mb-6">
          <CardHeader className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white">
            <CardTitle className="text-center text-2xl font-bold">Search for Rides</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Starting Point</label>
                <Input
                  type="text"
                  placeholder="From (e.g., UCLA)"
                  value={fromFilter}
                  onChange={(e) => setFromFilter(e.target.value)}
                  className="border-blue-200 focus:ring-blue-500 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <Input
                  type="text"
                  placeholder="To (e.g., Downtown)"
                  value={toFilter}
                  onChange={(e) => setToFilter(e.target.value)}
                  className="border-blue-200 focus:ring-blue-500 rounded-md"
                />
              </div>
              <button
                className="w-full bg-gradient-to-r from-[#0F172A] to-[#1E40AF] hover:from-[#172554] hover:to-[#2563EB] text-white shadow-md rounded-full py-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Search Matching Rides
                  </>
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white">
            <CardTitle className="text-center text-xl font-bold">Available Matching Rides</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500">Finding rides for you...</p>
              </div>
            ) : matchedRides.length > 0 ? (
              <div className="space-y-4">
                {matchedRides.map((ride) => (
                  <div key={ride.id} className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <p className="font-semibold text-blue-900">{ride.pickup_location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <p className="font-semibold text-blue-900">{ride.dropoff_location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(ride.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(ride.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button className="px-4 py-1 bg-gradient-to-r from-[#172554] to-[#2563eb] text-white text-sm shadow-sm rounded-full">
                        Contact Driver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No matching rides found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search criteria or check back later</p>
                <button 
                  className="px-6 py-1.5 bg-gradient-to-r from-[#172554] to-[#2563eb] text-white shadow-md rounded-full"
                  onClick={() => router.push("/offer-ride")}
                >
                  Offer a Ride Instead
                </button>
              </div>
            )}
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
