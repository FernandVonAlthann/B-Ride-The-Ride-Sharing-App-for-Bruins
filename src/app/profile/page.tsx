"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string; bio?: string; profilePic?: string; preferences?: any }>({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("http://localhost:5001/profile", { method: "GET", credentials: "include" });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black p-6">
      <Card className="w-full max-w-lg bg-white shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl">My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Profile Picture */}
          <div className="flex justify-center mb-4">
            <Image 
              src={user.profilePic || "/default-avatar.png"} 
              alt="Profile Picture" 
              width={100} 
              height={100} 
              className="rounded-full border border-gray-300"
            />
          </div>

          {/* Profile Details */}
          <p className="text-lg"><strong>Name:</strong> {user.name || "N/A"}</p>
          <p className="text-lg"><strong>Email:</strong> {user.email || "N/A"}</p>
          <p className="text-lg"><strong>Bio:</strong> {user.bio || "No bio set"}</p>

          {/* Preferences */}
          <h2 className="text-lg font-semibold mt-4">Preferences</h2>
          <p><strong>Language:</strong> {user.preferences?.language || "English"}</p>
          <p><strong>Ride Preference:</strong> {user.preferences?.ridePreference || "Comfort"}</p>
          <p><strong>Dark Mode:</strong> {user.preferences?.darkMode ? "Enabled" : "Disabled"}</p>
        </CardContent>
      </Card>

      <Button 
        className="mt-6 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 text-lg" 
        onClick={() => router.push("/dashboard")}
      >
        Back to Dashboard
      </Button>
      <Button 
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-lg" 
        onClick={() => router.push("/profileapp")}
      >
        Edit Profile
      </Button>
    </div>
  );
}
