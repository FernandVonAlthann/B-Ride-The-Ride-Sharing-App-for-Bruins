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

  const handleLogout = async() => {  // Delete User
    try
    {
      const res = await fetch(`http://localhost:5001/users/delete/${user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
       });

       const deletedUser = await res.json();

       alert("User deleted successfully!");
      router.push("/");
      
       if(!res.ok)
       {
        throw new Error(deletedUser.error);
       }  
    }
    catch(err)
    {
      alert(err.message);
    }
    router.push("/");
  };
  
  const handleSafeLogout = () => {  // Basic Logout
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    alert("Logged out successfully!");
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
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
      {/* Welcome Section */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-4">Welcome, {user.name || "Bruin"}! 🚗</h1>
        <p className="text-2xl">Ready to ride?</p>
      </div>

      {/* Grid Layout for Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Quick Actions Panel */}
        <Card className="bg-white text-gray-800 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/find-ride")}>
              Find a Ride
            </Button>
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/offer-ride")}>
              Offer a Ride
            </Button>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/forum")}>
              Forum
            </Button>
            <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/messages")}>
              Direct Messages
            </Button>
	     <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("map")}>
          View Map
        </Button>
	<Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("AI-Chat-Assistant")}>
          Chat With An Assistant
        </Button>
	<Button className="w-full bg-yellow-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/profile")}>
  	  View My Profile
        </Button>
	<Button className="w-full bg-blue-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/ride-history")}>
  	  View My Ride History
        </Button>
	<Button className="w-full bg-indigo-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/saved-locations")}>
  	  View My Saved Locations
        </Button>
	<Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/Ratings-Reviews")}>
  	  Ratings and Reviews
        </Button>
	<Button className="w-full bg-yellow-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/ride-matching")}>
  	  Live Matchmaking
        </Button>
	<Button className="w-full bg-blue-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/group-chat")}>
  	  Group Chat
        </Button>
	<Button className="w-full bg-purple-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/ride-cost")}>
  	  Estimate Cost
        </Button>
	<Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/payment")}>
  	  Payment
        </Button>
	<Button className="w-full bg-orange-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/dark-mode")}>
  	Enable Dark Mode
        </Button>
        <Button className="w-full bg-yellow-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/referral")}>
  	  Refer A Friend
      </Button>
      <Button className="w-full bg-blue-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/referral-redeem")}>
  	  Input Referral Code
      </Button>
      <Button className="w-full bg-purple-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={() => router.push("/language")}>
  	  Language
      </Button>
          </CardContent>
        </Card>

        {/* Upcoming Rides Panel */}
        <Card className="bg-white text-gray-800 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Upcoming Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {rides.length > 0 ? (
                rides.map((ride, index) => (
                  <div key={index} className="border-b pb-4 flex justify-between items-center">
                    <div>
                      <p className="text-xl font-semibold">{ride.from} → {ride.to}</p>
                      <p className="text-base text-gray-500">{new Date(ride.time).toLocaleString()}</p>
                    </div>
                    <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 text-base rounded-lg" onClick={() => deleteRide(index)}>
                      Delete
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-xl">No upcoming rides</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* GPS Panel */}
        <Card className="bg-white text-gray-800 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg py-3" onClick={getLocation}>
              Get Location
            </Button>
            {location && (
              <p className="text-center text-xl">Latitude: {location.lat}, Longitude: {location.lon}</p>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contact Panel */}
        <Card className="bg-white text-gray-800 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Emergency</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg text-lg py-3" onClick={() => router.push("/emergency-contact")}>
              🚨 Emergency Contact
            </Button>
          </CardContent>
        </Card>

        {/* Logout Panel */}
        <Card className="bg-white text-gray-800 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg text-lg py-3" onClick={handleLogout}>
              Delete Account
            </Button>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg text-lg py-3" onClick={handleSafeLogout}>
              Logout to Landing
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
