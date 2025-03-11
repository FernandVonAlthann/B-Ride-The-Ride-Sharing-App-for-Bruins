"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Ride {
  from: string;
  to: string;
  time: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ id?: string; name?: string; profilePic?: string; email?: string }>({});
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    const fetchUserData = () => {
      let userEmail = localStorage.getItem("userEmail") ?? ""; // Ensure it's always a string

      if (!userEmail) {
        console.warn("No user email found in localStorage. Attempting to get from 'user'...");
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

        if (storedUser?.email) {
          userEmail = storedUser.email;
          localStorage.setItem("userEmail", userEmail); // Fix missing email issue
        } else {
          console.error("No valid user data found. Redirecting to login...");
          router.push("/login"); // Force login if user data is missing
          return;
        }
      }

      fetch(`http://localhost:5001/users/email/${encodeURIComponent(userEmail)}`) // Ensure safe URL encoding
        .then((res) => res.json())
        .then((data) => {
          if (data && data.id) {
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
          } else {
            console.error("Fetched user data is invalid. Logging out...");
            handleLogout(); // If invalid data, force logout
          }
        })
        .catch((error) => console.error("Failed to fetch user:", error));
    };

    fetchUserData();
    window.addEventListener("storage", fetchUserData);

    return () => {
      window.removeEventListener("storage", fetchUserData);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F0F4F8] text-gray-900 shadow-xl flex flex-col items-center p-6 rounded-r-3xl">
        {/* Profile Picture */}
        <Image
          src={user.profilePic || "/default-avatar.png"}
          alt="Profile Picture"
          width={150}
          height={100}
          className="rounded-full border-4 border-gray-300 shadow-lg"
        />
        <h2 className="text-lg font-semibold mt-3">{user.name || "User"}</h2>
        <p className="text-sm text-gray-500">{user.email || "No email"}</p>

        {/* Sidebar Navigation */}
        <nav className="mt-6 w-full space-y-2">
          <Button className="w-full bg-gradient-to-r from-[#172554] to-[#2563eb] hover:opacity-90 text-white shadow-md rounded-full py-2 text-sm font-medium" onClick={() => router.push("/profile")}>
            View Profile
          </Button>
          <Button className="w-full bg-gradient-to-r from-[#4D9FFF] to-[#1E3A8A] hover:opacity-90 text-white shadow-md rounded-full py-2 text-sm font-medium" onClick={() => router.push("/ride-history")}>
            Ride History
          </Button>
        </nav>

          {/* Emergency Contact & Logout (Now At Bottom) */}
          <div className="mt-auto w-full space-y-2">
          <Button className="w-full bg-[#FF6B6B] hover:bg-[#D2665A] text-white shadow-md rounded-full py-2 text-sm font-medium" onClick={() => router.push("/emergency-contact")}>
            🚨 Emergency Contact
          </Button>
          <Button className="w-full bg-gradient-to-r  hover:bg-[#4D9FFF] to-[#D4A017]hover:opacity-90 text-white shadow-md rounded-full py-2 text-sm font-medium" onClick={() => router.push("/settings")}>
            Settings
          </Button>
          <Button 
  className="w-full bg-gradient-to-r from-[#4D9FFF] to-[#D4A017] text-white shadow-md rounded-full py-2 text-sm font-medium"
  onClick={handleLogout}  // Call handleLogout when clicking Logout
>
  Logout
</Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <h1 className="text-4xl font-bold tracking-tight">Welcome, {user.name || "User"}! 🚗</h1>
        <p className="text-md text-gray-300 mt-2">Ready to ride?</p>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button className="bg-[#E6B400] hover:bg-[#D4A017] text-black text-md font-semibold shadow-md rounded-full py-3" onClick={() => router.push("/find-ride")}>
            Find a Ride
          </Button>
          <Button className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-md font-semibold shadow-md rounded-full py-3" onClick={() => router.push("/offer-ride")}>
            Offer a Ride
          </Button>
          <Button className="bg-[#4D9FFF] hover:bg-[#2563eb] text-white text-md font-semibold shadow-md rounded-full py-3" onClick={() => router.push("/forum")}>
            Forum
          </Button>
          <Button className="bg-[#E6B400] hover:bg-[#D4A017] text-black text-md font-semibold shadow-md rounded-full py-3" onClick={() => router.push("/messages")}>
            Direct Messages
          </Button>
          <Button className="col-span-2 bg-[#172554] hover:bg-[#1E3A8A] text-white text-md font-semibold shadow-md rounded-full py-3" onClick={() => router.push("/map")}>
            View Map
          </Button>
        </div>

        {/* Upcoming Rides Section */}
        <Card className="w-full max-w-2xl bg-[#E6E8EB] text-gray-900 shadow-lg mt-8 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold text-gray-800">Upcoming Rides</CardTitle>
          </CardHeader>
          <CardContent>
            {rides.length > 0 ? (
              rides.map((ride, index) => (
                <div key={index} className="border-b pb-2 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">{ride.from} → {ride.to}</p>
                    <p className="text-sm text-gray-500">{new Date(ride.time).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No upcoming rides</p>
            )}
          </CardContent>
        </Card>

        {/* Additional Options */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Button className="bg-[#E6B400] hover:bg-[#D4A017] text-black text-md font-semibold shadow-md rounded-full py-3" onClick={() => router.push("/ride-matching")}>
            Live Matchmaking
          </Button>
          <Button className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-md font-semibold shadow-md rounded-full py-3" onClick={() => router.push("/group-chat")}>
            Group Chat
          </Button>
          <Button className="bg-[#E6B400] hover:bg-[#D4A017] text-black text-md font-semibold shadow-md rounded-full py-3" onClick={() => router.push("/ride-cost")}>
            Estimate Cost
          </Button>
          <Button className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-md font-semibold shadow-md rounded-full py-3" onClick={() => router.push("/payment")}>
            Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
