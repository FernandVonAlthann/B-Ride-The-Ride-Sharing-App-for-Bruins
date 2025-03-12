// src/components/Profile.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Profile({ userId }: { userId: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "Please Update Nickname",
    email: "user@gmail.com",
    bio: "Please Update Bio",
    profilePic: "/default-avatar.png",
    preferences: {
      language: "English",
      ridePreference: "Comfort",
    },
  });

  // Fetch profile data from the API
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error("Failed to fetch profile:", error));
  }, []);

  // Handle profile picture upload
  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, profilePic: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle text field changes
  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Handle preference changes
  const handlePreferenceChange = (field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value },
    }));
  };

  // Save profile to the database via the API
  const saveProfile = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        alert("Profile saved!");
      } else {
        console.error("Error saving profile");
      }
    } catch (error) {
      console.error("Error saving profile", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2563EB] to-[#020B3B] p-6">
      <h1 className="text-3xl font-bold mb-4 text-white">Edit Your Profile</h1>
      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl w-[400px] text-center">
        {/* Profile Picture */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src={profile.profilePic}
            alt="Profile Picture"
            width={128}
            height={128}
            className="rounded-full object-cover border-4 border-[#3B82F6]/50 shadow-lg"
          />
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleProfilePicChange}
          />
        </div>

        {/* Name Input */}
        <label className="block font-semibold text-left text-gray-800">Nickname</label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="border p-2 w-full mb-4 rounded-md"
        />

        {/* Bio Input */}
        <label className="block font-semibold text-left text-gray-800">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          className="border p-2 w-full mb-4 h-20 rounded-md"
        />

        {/* Preferences */}
        <h2 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Preferences</h2>

        {/* Language Selection */}
        <label className="block font-semibold text-left mt-3 text-gray-800">Language</label>
        <select
          value={profile.preferences.language}
          onChange={(e) => handlePreferenceChange("language", e.target.value)}
          className="border p-2 w-full mb-4 rounded-md"
        >
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>

        {/* Ride Preferences */}
        <label className="block font-semibold text-left text-gray-800">Ride Preference</label>
        <select
          value={profile.preferences.ridePreference}
          onChange={(e) => handlePreferenceChange("ridePreference", e.target.value)}
          className="border p-2 w-full mb-4 rounded-md"
        >
          <option>Comfort</option>
          <option>Economy</option>
          <option>Luxury</option>
        </select>

        {/* Save Button */}
        <button
          onClick={saveProfile}
          className="w-full bg-gradient-to-r from-[#0F172A] to-[#1E40AF] hover:from-[#172554] hover:to-[#2563EB] text-white shadow-md rounded-full py-2 text-sm font-medium transition-all mt-4"
        >
          Save Changes
        </button>
        
        <div className="mt-4 flex justify-center gap-4">
          <button
            className="px-6 py-1.5 bg-gradient-to-r from-[#172554] to-[#2563eb] text-white shadow-md rounded-full"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </button>
          <button
            className="px-6 py-1.5 bg-gradient-to-r from-[#172554] to-[#2563eb] text-white shadow-md rounded-full"
            onClick={() => router.push("/profile")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
