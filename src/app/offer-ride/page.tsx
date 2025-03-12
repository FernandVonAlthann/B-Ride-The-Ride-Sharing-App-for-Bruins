"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OfferRide = () => {
  const router = useRouter();
  const [rideType, setRideType] = useState("offer"); // "offer" or "request"
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    pickupLocation: "",
    dropoffLocation: "",
    description: "",
    seats: 1,
    cost: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token"); // get token
      const userId = user.id;
  
      if (!userId || !token) {
        alert("You must be logged in to post a ride.");
        router.push("/login");
        return;
      }
  
      // Define base data structure
      const rideData: {
        user_id: number;
        from_city: string;
        to_city: string;
        pickup_location: string;
        dropoff_location: string;
        departure_time: string;
        description: string;
        cost?: number;
        available_seats?: number;
      } = {
        user_id: userId,
        from_city: formData.from.trim(),
        to_city: formData.to.trim(),
        pickup_location: formData.pickupLocation.trim(),
        dropoff_location: formData.dropoffLocation.trim(),
        departure_time: `${formData.date}T${formData.time}:00`,
        description: formData.description.trim() || "",
      };
  
      if (rideType === "offer") {
        const parsedCost = parseFloat(formData.cost.trim());
        if (isNaN(parsedCost) || parsedCost < 0) {
          alert("Please enter a valid cost.");
          setIsSubmitting(false);
          return;
        }
        rideData.cost = parsedCost;
        rideData.available_seats = parseInt(formData.seats.toString(), 10);
      }
  
      const apiEndpoint = rideType === "offer" ? "/rides/create" : "/rides/request";
  
      const response = await fetch(`http://localhost:5001${apiEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rideData),
      });
      
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post ride");
      }
  
      alert(`Ride ${rideType === "offer" ? "offered" : "requested"} successfully!`);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error posting ride:", error);
      alert(error instanceof Error ? error.message : "Failed to post ride");
    } finally {
      setIsSubmitting(false);
    }
  };
  
   
      

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] p-6 flex flex-col items-center">
      {/* Back to Dashboard Button */}
      <Button className="self-start mb-6 bg-[#172554] hover:bg-[#1E3A8A] text-white shadow-md rounded-full px-6 py-2 flex items-center gap-2"
        onClick={() => router.push("/dashboard")}>
        ← Back to Dashboard
      </Button>

      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm text-gray-900 shadow-xl rounded-2xl border-t border-white/50">
        <CardHeader className="bg-gradient-to-r from-[#4D9FFF] to-[#2563EB] text-white rounded-t-2xl p-6">
          <CardTitle className="text-center text-2xl font-bold">
            {rideType === "offer" ? "Offer a Ride" : "Request a Ride"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ride Type Selector */}
        {/* Ride Type Toggle */}
<div className="flex justify-center mb-6">
  <div className="bg-gray-200 p-1 rounded-full flex gap-1">
    <button
      type="button"
      className={`px-6 py-2 rounded-full font-medium transition-all ${
        rideType === "offer"
          ? "bg-[#4D9FFF] text-white shadow-md"
          : "bg-transparent text-gray-600"
      }`}
      onClick={() => setRideType("offer")}
    >
      Offer a Ride
    </button>
    <button
      type="button"
      className={`px-6 py-2 rounded-full font-medium transition-all ${
        rideType === "request"
          ? "bg-[#4D9FFF] text-white shadow-md"
          : "bg-transparent text-gray-600"
      }`}
      onClick={() => setRideType("request")}
    >
      Request a Ride
    </button>
  </div>
</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">From (City)</label>
                <input name="from" value={formData.from} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-xl" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">To (City)</label>
                <input name="to" value={formData.to} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-xl" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-xl" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
              <input name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-xl" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Dropoff Location</label>
              <input name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-xl" />
            </div>

            {rideType === "offer" && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Seats Available</label>
                  <input type="number" name="seats" value={formData.seats} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-xl" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Cost (USD)</label>
                  <input type="number" name="cost" value={formData.cost} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-xl" />
                </div>
              </>
            )}

            <Button type="submit" className="w-full bg-[#E6B400] text-black font-semibold py-3 rounded-full">
              {isSubmitting ? "Posting..." : rideType === "offer" ? "Offer Ride" : "Request Ride"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferRide;
