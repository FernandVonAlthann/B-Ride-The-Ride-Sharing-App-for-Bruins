"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Ride = {
  title: string;
  from: string;
  to: string;
  time: string;
  maxPassengers: number;
  price: number;
  description: string;
  user: {
    name: string;
    profilePic: string;
  };
};

export default function OfferRide() {
  const [title, setTitle] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [time, setTime] = useState("");
  const [maxPassengers, setMaxPassengers] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    const storedRides: Ride[] = JSON.parse(localStorage.getItem("rides") || "[]");
    setRides(storedRides);
  }, []);

  const postRide = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!storedUser.id) {
      alert("You must be logged in to post a ride.");
      return;
    }
  
    if (!title || !from || !to || !time || !maxPassengers || !price) {
      alert("Please fill in all fields.");
      return;
    }
  
    const newRide = {
      user_id: storedUser.id,
      title,
      pickup_location: from,
      dropoff_location: to,
      time,
      max_passengers: parseInt(maxPassengers, 10),
      price: parseFloat(price),
      description,
    };
  
    try {
      const response = await fetch("http://localhost:5001/rides/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRide),
      });
  
      if (!response.ok) {
        throw new Error("Failed to post ride");
      }
  
      const rideData = await response.json();
  
      // Update rides in localStorage and notify Dashboard
      const updatedRides = [...rides, { ...rideData, user: storedUser }];
      setRides(updatedRides);
      localStorage.setItem("rides", JSON.stringify(updatedRides));
      window.dispatchEvent(new Event("storage"));
  
      alert("Ride posted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error posting ride:", error);
      alert("Failed to post ride.");
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] p-6">
      <div className="bg-[#F0F4F8] text-gray-900 shadow-lg rounded-lg p-8 w-full max-w-lg">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Offer a Ride</h1>

        {/* Ride Form */}
        <div className="space-y-4">
          <Input
            placeholder="Ride Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-3 rounded-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none"
            />
            <Input
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-3 rounded-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none"
            />
          </div>

          <Input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-3 rounded-full bg-white text-gray-900 border border-gray-300 focus:outline-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Max Passengers"
              type="number"
              value={maxPassengers}
              onChange={(e) => setMaxPassengers(e.target.value)}
              className="w-full p-3 rounded-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none"
            />
            <Input
              placeholder="Fixed Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 rounded-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none"
            />
          </div>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none"
            rows={3}
          ></textarea>

          <Button
            className="w-full bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-semibold p-3 rounded-full transition duration-300 shadow-md"
            onClick={postRide}
          >
            Post Ride
          </Button>
        </div>
      </div>
    </div>
  );
}
