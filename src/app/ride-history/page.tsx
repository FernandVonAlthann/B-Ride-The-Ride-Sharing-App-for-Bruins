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

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const res = await fetch('/api/ride-history');
        if (!res.ok) {
          throw new Error("Failed to fetch ride history");
        }
        const data = await res.json();
        setRideHistory(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRideHistory();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-400 to-blue-500 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Ride History</h1>
      <Card className="w-full max-w-lg bg-gray-100 text-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Past Rides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rideHistory.length > 0 ? (
              rideHistory.map((ride, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="text-lg font-semibold">
                    {ride.from} → {ride.to}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(ride.time).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No past rides</p>
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
    </div>
  );
}
