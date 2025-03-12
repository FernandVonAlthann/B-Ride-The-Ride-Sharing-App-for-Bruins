"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Ride {
  from: string;
  to: string;
  time: string;
}

export default function RideHistory() {
  const router = useRouter();
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const res = await fetch("/api/ride-history");
        if (!res.ok) throw new Error("Failed to fetch ride history");

        const data = await res.json();
        setRideHistory(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRideHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-white mb-6">Ride History 🚗</h1>

      <Card className="w-full max-w-2xl bg-white/90 shadow-xl rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-[#4D9FFF] to-[#2563EB] text-white rounded-t-2xl p-6">
          <CardTitle className="text-center text-2xl font-bold">
            Past Rides
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {isLoading ? (
            <div className="text-center py-6 text-gray-600">
              Loading ride history...
            </div>
          ) : rideHistory.length > 0 ? (
            rideHistory.map((ride, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-xl shadow-sm border border-gray-200"
              >
                <p className="text-lg font-semibold text-gray-900 flex justify-between">
                  <span>{ride.from}</span>
                  <span className="text-gray-500">→</span>
                  <span>{ride.to}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  🕒 {new Date(ride.time).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No past rides found</p>
          )}
        </CardContent>
      </Card>

      <Button
        className="mt-6 bg-[#E6B400] hover:bg-[#D4A017] text-black font-medium py-3 rounded-full shadow-md"
        onClick={() => router.push("/dashboard")}
      >
        Back to Dashboard
      </Button>
    </div>
  );
}

