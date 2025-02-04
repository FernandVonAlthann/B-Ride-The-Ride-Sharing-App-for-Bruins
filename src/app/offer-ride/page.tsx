"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import router
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OfferRide() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [time, setTime] = useState("");
  const router = useRouter(); // Initialize router

  const postRide = () => {
    if (from.trim() && to.trim() && time.trim()) {
      const newRide = { from, to, time };
      const storedRides = JSON.parse(localStorage.getItem("rides") || "[]");
      const updatedRides = [...storedRides, newRide];

      localStorage.setItem("rides", JSON.stringify(updatedRides)); // Save rides
      setFrom("");
      setTo("");
      setTime("");

      router.push("/dashboard"); // Redirect to dashboard
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Offer a Ride</h1>

      <Input placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} />
      <Input placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} className="mt-2" />
      <Input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} className="mt-2" />
      
      <div className="flex justify-between mt-4">
        {/* Go Back Button */}
        <Button onClick={() => router.push("/dashboard")} className="bg-gray-500 hover:bg-gray-600 text-white">
          Go Back
        </Button>

        {/* Post Ride Button */}
        <Button onClick={postRide} className="bg-blue-600 hover:bg-blue-700 text-white">
          Post Ride
        </Button>
      </div>
    </div>
  );
}
