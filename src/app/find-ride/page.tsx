"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Ride {
  id: string;
  user_id: number;
  from: string;
  to: string;
  date: string;
  time: string;
  pickupLocation: string;
  dropoffLocation: string;
  seats?: number;
  cost?: number | null;
  description?: string;
  rideType: "offer" | "request";
  driver: {
    name: string;
    profilePic: string;
  };
}

const FindRide = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id?: number }>({});
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("http://localhost:5001/rides/all");
        if (!response.ok) throw new Error("Failed to fetch rides");

        const ridesData = await response.json();

        const transformedRides: Ride[] = ridesData.map((ride: any) => ({
          id: ride.id.toString(),
          user_id: ride.user_id,
          from: ride.from_city || ride.pickup_location || "Unknown From",
          to: ride.to_city || ride.dropoff_location || "Unknown To",
          date: ride.departure_time
            ? new Date(ride.departure_time).toISOString().split("T")[0]
            : "TBD",
          time: ride.departure_time
            ? new Date(ride.departure_time).toTimeString().substring(0, 5)
            : "TBD",
          pickupLocation: ride.pickup_location,
          dropoffLocation: ride.dropoff_location,
          seats:
            ride.rideType === "offer" ? ride.available_seats ?? 1 : undefined,
          cost: ride.cost ? Number(ride.cost) : 0,
          description: ride.description || "",
          rideType: ride.ride_type,
          driver: {
            name: ride.driver_name || ride.requester_name || "Unknown",
            profilePic:
              ride.driver_profile_pic ||
              ride.requester_profile_pic ||
              "/default-avatar.png",
          },
        }));

        setAvailableRides(transformedRides);
        setFilteredRides(transformedRides);
      } catch (err) {
        console.error("Error fetching rides:", err);
        setError("Failed to fetch rides. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRides();
  }, []);

  useEffect(() => {
    let searchLower = searchQuery.toLowerCase();

    let filtered = availableRides.filter(
      (ride) =>
        ride.from.toLowerCase().includes(searchLower) ||
        ride.to.toLowerCase().includes(searchLower) ||
        ride.pickupLocation.toLowerCase().includes(searchLower) ||
        ride.dropoffLocation.toLowerCase().includes(searchLower)
    );

    if (selectedFilter) {
      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split("T")[0];

      if (selectedFilter === "Today") {
        filtered = filtered.filter((ride) => ride.date === today);
      } else if (selectedFilter === "Tomorrow") {
        filtered = filtered.filter((ride) => ride.date === tomorrowDate);
      } else if (selectedFilter === "This Week") {
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
        filtered = filtered.filter((ride) => {
          const rideDate = new Date(ride.date);
          return rideDate >= new Date() && rideDate <= oneWeekFromNow;
        });
      }
    }

    setFilteredRides(filtered);
  }, [searchQuery, availableRides, selectedFilter]);

  const handleRequestRide = async (rideId: string, rideOwnerId: number) => {
    const token = localStorage.getItem("token");
    if (!user?.id) {
      alert("You must be logged in to request a ride.");
      return;
    }

    const defaultMessage = "Hey! I'm interested in joining your ride.";

    try {
      const response = await fetch("http://localhost:5001/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: rideOwnerId,
          rideId,
          message: defaultMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      setNotification({
        show: true,
        message: "Message sent to the ride owner!",
      });
      setTimeout(() => setNotification({ show: false, message: "" }), 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      alert(error instanceof Error ? error.message : "Failed to send message");
    }
  };
  const handleDeleteRide = async (rideId: string, rideOwnerId: number) => {
    if (!confirm("Are you sure you want to delete this ride?")) return;

    const token = localStorage.getItem("token");
    if (!user.id) {
      alert("You must be logged in to delete a ride.");
      return;
    }
    if (user.id !== rideOwnerId) {
      alert("You can only delete your own rides.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/rides/delete/${rideId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete ride");
      }

      alert("Ride deleted successfully!");
      setAvailableRides((prev) => prev.filter((ride) => ride.id !== rideId));
      setFilteredRides((prev) => prev.filter((ride) => ride.id !== rideId));
    } catch (error) {
      console.error("Error deleting ride:", error);
      alert(error instanceof Error ? error.message : "Failed to delete ride");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] p-6 flex flex-col">
      {notification.show && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {notification.message}
        </div>
      )}

      <Button
        className="self-start mb-6 bg-[#172554] text-white px-6 py-2 rounded-full"
        onClick={() => router.push("/dashboard")}
      >
        ← Back to Dashboard
      </Button>

      <Card className="w-full max-w-4xl mx-auto bg-white/90 shadow-xl rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-[#4D9FFF] to-[#2563EB] text-white rounded-t-2xl p-6">
          <CardTitle className="text-center text-2xl font-bold">
            Find a Ride
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative mb-6">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-xl text-black focus:ring-2 focus:ring-[#4D9FFF]"
              placeholder="Search by location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {["Today", "Tomorrow", "This Week"].map((filter) => (
              <Button
                key={filter}
                className={`px-4 py-2 rounded-lg border ${
                  selectedFilter === filter
                    ? "bg-[#4D9FFF] text-white border-[#4D9FFF]"
                    : "bg-white text-black border-gray-300"
                }`}
                onClick={() =>
                  setSelectedFilter(selectedFilter === filter ? null : filter)
                }
              >
                {filter}
              </Button>
            ))}
          </div>
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4D9FFF]"></div>
              <p className="mt-2 text-gray-500">Loading rides...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredRides.length > 0 ? (
            filteredRides.map((ride) => (
              <Card
                key={ride.id}
                className="w-full bg-white shadow-lg rounded-xl overflow-hidden my-4 border border-gray-200"
              >
                <div className="p-5 flex flex-col md:flex-row gap-4">
                  <div className="flex-grow space-y-4">
                    <span
                      className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                        ride.rideType === "offer"
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {ride.rideType === "offer"
                        ? "Offering Ride"
                        : "Requesting Ride"}
                    </span>

                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <span>{ride.from}</span> → <span>{ride.to}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-800">
                      <span>
                        <strong>Date:</strong> {ride.date}
                      </span>
                      <span>
                        <strong>Time:</strong> {ride.time}
                      </span>
                      {ride.rideType === "offer" && (
                        <span>
                          <strong>Seats:</strong> {ride.seats} available
                        </span>
                      )}
                      {ride.rideType === "offer" && (
                        <span className="font-semibold">
                          <strong>Cost:</strong>{" "}
                          {ride.cost !== null
                            ? `$${Number(ride.cost).toFixed(2)}`
                            : "Free"}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-gray-700">
                      <span>
                        <strong>Pickup Location:</strong> {ride.pickupLocation}
                      </span>
                      <span>
                        <strong>Dropoff Location:</strong>{" "}
                        {ride.dropoffLocation}
                      </span>
                    </div>

                    {ride.description && (
                      <p className="text-gray-600">{ride.description}</p>
                    )}

                    {user?.id != null &&
                      ride.user_id != null &&
                      user.id === ride.user_id && (
                        <Button
                          onClick={() =>
                            handleDeleteRide(ride.id, ride.user_id)
                          }
                          className="bg-red-500 text-white px-6 py-2 rounded-full"
                        >
                          Delete
                        </Button>
                      )}

                    {ride.rideType === "offer" && (
                      <Button
                        onClick={() => handleRequestRide(ride.id, ride.user_id)}
                        className="bg-[#E6B400] text-black px-6 py-2 rounded-full font-medium shadow-md"
                      >
                        Request Ride
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center gap-3">
                    <img
                      src={ride.driver.profilePic}
                      alt={ride.driver.name}
                      className="w-14 h-14 rounded-full object-cover border border-gray-300"
                    />
                    <div className="text-center">
                      <h4 className="font-medium text-gray-800">
                        {ride.driver.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {ride.rideType === "offer" ? "Driver" : "Requester"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">
                No rides found matching your criteria.
              </p>
              <Button
                className="mt-4 bg-[#E6B400] text-black px-6 py-2 rounded-full font-medium shadow-md"
                onClick={() => router.push("/offer-ride")}
              >
                Post a Ride Instead
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FindRide;

