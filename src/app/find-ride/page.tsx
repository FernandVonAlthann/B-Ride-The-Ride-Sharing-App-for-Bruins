"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import router
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FindRide() {
  const [rides, setRides] = useState<{ from: string; to: string; time: string }[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter(); // Initialize router
  
  useEffect(() => {
    const storedRides = JSON.parse(localStorage.getItem("rides") || "[]");
    setRides(storedRides);
  }, []);

  const filteredRides = rides.filter(ride => ride.from.includes(search) || ride.to.includes(search));

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Find a Ride</h1>

      <Input placeholder="Search by location..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="mt-4">
        {filteredRides.map((ride, idx) => (
          <div key={idx} className="border p-4 mb-2">
            <p><strong>{ride.from} → {ride.to}</strong></p>
            <p className="text-gray-500">{ride.time}</p>
          </div>
        ))}
      </div>
      <Button onClick={() => router.push("/dashboard")} className="bg-gray-500 hover:bg-gray-600 text-white">
          Go Back
      </Button>
    </div>
  );
}
