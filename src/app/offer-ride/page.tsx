"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OfferRide() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [time, setTime] = useState("");
  const [maxPassengers, setMaxPassengers] = useState("");
  const [price, setPrice] = useState("");
  const router = useRouter();

  const postRide = () => {
    // Ensure all fields are filled before posting
    if (
      from.trim() &&
      to.trim() &&
      time.trim() &&
      maxPassengers.trim() &&
      price.trim()
    ) {
      // Create a new ride object
      const newRide = {
        from,
        to,
        time,
        maxPassengers: parseInt(maxPassengers, 10), // convert to number
        price: parseFloat(price), // convert to number (for decimals)
      };

      // Retrieve any previously saved rides and update them
      const storedRides = JSON.parse(localStorage.getItem("rides") || "[]");
      const updatedRides = [...storedRides, newRide];

      // Save the updated rides list to localStorage
      localStorage.setItem("rides", JSON.stringify(updatedRides));

      // Reset form fields
      setFrom("");
      setTo("");
      setTime("");
      setMaxPassengers("");
      setPrice("");

      // Redirect to dashboard
      router.push("/dashboard");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Offer a Ride</h1>

      <Input
        placeholder="From"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />
      <Input
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="mt-2"
      />
      <Input
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="mt-2"
      />

      {/* New Input for Max Passengers */}
      <Input
        placeholder="Max Passengers"
        type="number"
        value={maxPassengers}
        onChange={(e) => setMaxPassengers(e.target.value)}
        className="mt-2"
      />

      {/* New Input for Fixed Price */}
      <Input
        placeholder="Fixed Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="mt-2"
      />

      <div className="flex justify-between mt-4">
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-500 hover:bg-gray-600 text-white"
        >
          Go Back
        </Button>
        <Button
          onClick={postRide}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Post Ride
        </Button>
      </div>
    </div>
  );
}
