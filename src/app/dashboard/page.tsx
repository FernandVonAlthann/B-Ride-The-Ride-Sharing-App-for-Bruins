"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface Ride {
  id: string;
  from: string;
  to: string;
  time: string;
  departure_time: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id?: string;
    name?: string;
    profilePic?: string;
    email?: string;
  }>({});
  const [recentRide, setRecentRide] = useState<Ride | null>(null);

  useEffect(() => {
    const fetchUserData = () => {
      let userEmail = localStorage.getItem("userEmail") ?? "";

      if (!userEmail) {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

        if (storedUser?.email) {
          userEmail = storedUser.email;
          localStorage.setItem("userEmail", userEmail);
        } else {
          router.push("/login");
          return;
        }
      }

      fetch(
        `http://localhost:5001/users/email/${encodeURIComponent(userEmail)}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.id) {
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
            fetchRecentRide(data.id); // Fetch recent ride after getting user data
          } else {
            handleLogout();
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

  const fetchRecentRide = async (userId: string) => {
    try {
      const res = await fetch(
        `http://localhost:5001/rides/user/${userId}/recent`
      );
      if (!res.ok) throw new Error("Failed to fetch recent ride");

      const rideData = await res.json();
      if (rideData) setRecentRide(rideData);
    } catch (error) {
      console.error("Error fetching recent ride:", error);
    }
  };

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
          <Button
            className="w-full bg-[#172554] text-white shadow-md rounded-full py-2 text-sm font-medium"
            onClick={() => router.push("/profile")}
          >
            View Profile
          </Button>
          <Button
            className="w-full bg-[#4D9FFF] text-white shadow-md rounded-full py-2 text-sm font-medium"
            onClick={() => router.push("/ride-history")}
          >
            Ride History
          </Button>
          <Button
            className="w-full bg-[#4D9FFF] text-white shadow-md rounded-full py-2 text-sm font-medium"
            onClick={() => router.push("/messages")}
          >
            Direct Messages
          </Button>
        </nav>

        {/* Emergency Contact & Logout */}
        <div className="mt-auto w-full space-y-2">
          <Button
            className="w-full bg-[#FF6B6B] text-white shadow-md rounded-full py-2 text-sm font-medium"
            onClick={() => router.push("/emergency-contact")}
          >
            🚨 Emergency Contact
          </Button>
          <Button
            className="w-full bg-[#4D9FFF] text-white shadow-md rounded-full py-2 text-sm font-medium"
            onClick={() => router.push("/settings")}
          >
            Settings
          </Button>
          <Button
            className="w-full bg-[#E6B400] text-black shadow-md rounded-full py-2 text-sm font-medium"
            onClick={handleLogout}
          >
            Logout
          </Button>
          <Button
            className="w-full bg-[#E6B400] text-black shadow-md rounded-full py-2 text-sm font-medium"
            onClick={handleLogout}
          >
            Delete Account
          </Button>
        </div>
      </aside>

      {/* Main Content */}

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome, {user.name || "User"}! 🚗
        </h1>
        <p className="text-md text-gray-300 mt-2">Ready to ride?</p>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button
            className="bg-[#E6B400] text-black font-semibold shadow-md rounded-full py-3"
            onClick={() => router.push("/find-ride")}
          >
            Find a Ride
          </Button>
          <Button
            className="bg-[#2563EB] text-white font-semibold shadow-md rounded-full py-3"
            onClick={() => router.push("/offer-ride")}
          >
            Offer a Ride
          </Button>
          <Button
            className="bg-[#2563EB] text-white font-semibold shadow-md rounded-full py-3"
            onClick={() => router.push("/offer-ride")}
          >
            Chat With An Assistant
          </Button>
          <Button
            className="bg-[#2563EB] text-white font-semibold shadow-md rounded-full py-3"
            onClick={() => router.push("/offer-ride")}
          >
            View My Saved Locations
          </Button>
          <Button
            className="bg-[#E6B400] text-black font-semibold shadow-md rounded-full py-3"
            onClick={() => router.push("/find-ride")}
          >
            Ratings and Reviews
          </Button>
          <Button
            className="bg-[#2563EB] text-white font-semibold shadow-md rounded-full py-3"
            onClick={() => router.push("/offer-ride")}
          >
            Enable Dark Mode
          </Button>
          <Button
            className="bg-[#2563EB] text-white font-semibold shadow-md rounded-full py-3"
            onClick={() => router.push("/offer-ride")}
          >
            Refer A Friend
          </Button>
          <Button
            className="bg-[#E6B400]text-black font-semibold shadow-md rounded-full py-3"
            onClick={() => router.push("/find-ride")}
          >
            Input Referral Code
          </Button>
          <Button
            className="bg-[#2563EB] text-white font-semibold shadow-md rounded-full py-3"
            onClick={() => router.push("/find-ride")}
          >
            Language
          </Button>
          <Button
            className=" bg-green-500 text-white font-semibold shadow-md rounded-full py-3"
            onClick={() => router.push("/find-ride")}
          >
            View Map
          </Button>
        </div>

        {/* Recent Ride Section */}
        <Card className="w-full max-w-2xl bg-white/90 shadow-xl mt-8 rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-[#4D9FFF] to-[#2563EB] text-white rounded-t-2xl p-6">
            <CardTitle className="text-center text-xl font-semibold">
              Your Most Recent Ride
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {recentRide ? (
              <div className="text-gray-900 space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>{recentRide.from}</span> → <span>{recentRide.to}</span>
                </div>
                <p className="text-gray-600 text-sm">
                  🕒 {new Date(recentRide.departure_time).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-center text-gray-600">No recent rides found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
