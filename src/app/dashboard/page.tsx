"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Ride {
  from: string;
  to: string;
  time: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string }>({});
  const [rides, setRides] = useState<Ride[]>([]);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    // Retrieve user info
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);

    // Retrieve and sort rides
    loadRides();
  }, []);

  const loadRides = () => {
    const storedRides = JSON.parse(localStorage.getItem("rides") || "[]");
    const sortedRides = storedRides.sort((a: Ride, b: Ride) => new Date(a.time).getTime() - new Date(b.time).getTime());
    setRides(sortedRides);
  };

  const deleteRide = (index: number) => {
    const updatedRides = [...rides];
    updatedRides.splice(index, 1); // Remove the ride at the given index

    localStorage.setItem("rides", JSON.stringify(updatedRides)); // Save updated list
    setRides(updatedRides); // Update state
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };
  
  const handleSafeLogout = () => {
    router.push("/");
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          alert("Error getting location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
      <h1 className="text-4xl font-bold mb-2">Welcome, {user.name || "Bruin"}! 🚗</h1>
      <p className="text-lg mb-6">Ready to ride?</p>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-lg" onClick={() => router.push("/find-ride")}>
          Find a Ride
        </Button>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 text-lg" onClick={() => router.push("/offer-ride")}>
          Offer a Ride
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-lg" onClick={() => router.push("/forum")}>
          Forum
        </Button>
        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 text-lg" onClick={() => router.push("/messages")}>
          Direct Messages
        </Button>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 text-lg col-span-2" onClick={() => router.push("map")}>
          View Map
        </Button>
	<Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-lg mb-4" onClick={() => router.push("/profile")}>
  	  View My Profile
        </Button>
	<Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-lg mb-4" onClick={() => router.push("/ride-history")}>
  	  View My Ride History
        </Button>
	<Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-lg mb-4" onClick={() => router.push("/saved-locations")}>
  	  View My Saved Locations
        </Button>
	<Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-lg mb-4" onClick={() => router.push("/Ratings-Reviews")}>
  	  Ratings and Reviews
        </Button>
	<Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-lg mb-4" onClick={() => router.push("/ride-matching")}>
  	  Live Matchmaking
        </Button>
	<Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-lg mb-4" onClick={() => router.push("/group-chat")}>
  	  Group Chat
        </Button>
	<Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-lg mb-4" onClick={() => router.push("/ride-cost")}>
  	  Estimate Cost
        </Button>
	<Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-lg mb-4" onClick={() => router.push("/payment")}>
  	  Payment
        </Button>
      </div>

      {/* Upcoming Rides Section */}
      <Card className="w-full max-w-lg bg-white text-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Upcoming Rides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rides.length > 0 ? (
              rides.map((ride, index) => (
                <div key={index} className="border-b pb-2 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">{ride.from} → {ride.to}</p>
                    <p className="text-sm text-gray-500">{new Date(ride.time).toLocaleString()}</p>
                  </div>
                  <Button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 text-sm" onClick={() => deleteRide(index)}>
                    Delete
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No upcoming rides</p>
            )}
          </div>
        </CardContent>
      </Card>

       {/* GPS Button */}
      <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-lg mb-4" onClick={getLocation}>
        Get Location
      </Button>
      {location && (
        <p className="text-lg mb-4">Latitude: {location.lat}, Longitude: {location.lon}</p>
      )}
      <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-lg mb-4" onClick={() => router.push("/emergency-contact")}>
        🚨 Emergency Contact
      </Button>
      <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-lg mb-4" onClick={() => router.push("/dark-mode")}>
  	Enable Dark Mode
      </Button>
      <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-lg mb-4" onClick={() => router.push("/referral")}>
  	  Refer A Friend
      </Button>
      <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-lg mb-4" onClick={() => router.push("/referral-redeem")}>
  	  Input Referral Code
      </Button>
      <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-lg mb-4" onClick={() => router.push("/language")}>
  	  Language
      </Button>
      {/* Sign out Button */}
      <Button className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-lg" onClick={handleLogout}>
        Delete Account In As Fast As A Single Click
      </Button>
      <Button className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-lg" onClick={handleSafeLogout}>
        Logout to Landing
      </Button>
    </div>
  );
}
