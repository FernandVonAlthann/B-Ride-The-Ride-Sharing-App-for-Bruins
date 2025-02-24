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

  const fetchRides = async (from = "", to = "") => {
    try {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black p-6">
      <Card className="w-full max-w-lg bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Ride Matching</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="From (e.g., UCLA)"
              value={fromFilter}
              onChange={(e) => setFromFilter(e.target.value)}
            />
            <Input
              type="text"
              placeholder="To (e.g., Downtown)"
              value={toFilter}
              onChange={(e) => setToFilter(e.target.value)}
            />
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSearch}
            >
              Search Matching Rides
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-lg bg-white shadow-lg mt-6 p-4">
        <h2 className="text-xl font-bold mb-4">Matching Rides</h2>
        {matchedRides.length > 0 ? (
          matchedRides.map((ride) => (
            <div key={ride.id} className="border-b pb-2 mb-2">
              <p className="font-semibold">
                {ride.pickup_location} → {ride.dropoff_location}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(ride.created_at).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No matching rides found.</p>
        )}
      </div>

      <Button
        className="mt-6 bg-gray-500 hover:bg-gray-600 text-white"
        onClick={() => router.push("/dashboard")}
      >
        Back to Dashboard
      </Button>
    </div>
  );
}
