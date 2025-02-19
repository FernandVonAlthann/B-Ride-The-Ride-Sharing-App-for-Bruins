"use client";
import { useEffect, useState } from "react";

interface Ride {
  id: number;
  pickup_location: string;
  dropoff_location: string;
  status: string;
}

export default function RideList() {
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    async function fetchRides() {
      const res = await fetch("/api/rides");
      const data = await res.json();
      setRides(data);
    }
    fetchRides();
  }, []);

  return (
    <div className="p-4 bg-gray-100">
      <h2>Available Rides</h2>
      <ul>
        {rides.map((ride) => (
          <li key={ride.id}>
            {ride.pickup_location} → {ride.dropoff_location} ({ride.status})
          </li>
        ))}
      </ul>
    </div>
  );
}