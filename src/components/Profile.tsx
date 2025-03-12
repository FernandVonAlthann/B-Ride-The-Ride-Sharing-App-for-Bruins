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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Edit Your Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-[400px] text-center">
        {/* Profile Picture */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src={profile.profilePic}
            alt="Profile Picture"
            width={128}
            height={128}
            className="rounded-full object-cover border border-gray-300"
          />
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleProfilePicChange}
          />
        </div>

        {/* Name Input */}
        <label className="block font-semibold text-left">Nickname</label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="border p-2 w-full mb-4"
        />

        {/* Bio Input */}
        <label className="block font-semibold text-left">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          className="border p-2 w-full mb-4 h-20"
        />

        {/* Preferences */}
        <h2 className="text-lg font-semibold mt-4 mb-2">Preferences</h2>

        {/* Language Selection */}
        <label className="block font-semibold text-left mt-3">Language</label>
        <select
          value={profile.preferences.language}
          onChange={(e) => handlePreferenceChange("language", e.target.value)}
          className="border p-2 w-full mb-4"
        >
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>

        {/* Ride Preferences */}
        <label className="block font-semibold text-left">Ride Preference</label>
        <select
          value={profile.preferences.ridePreference}
          onChange={(e) => handlePreferenceChange("ridePreference", e.target.value)}
          className="border p-2 w-full mb-4"
        >
          <option>Comfort</option>
          <option>Economy</option>
          <option>Luxury</option>
        </select>

        {/* Save Button */}
        <button
          onClick={saveProfile}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
        >
          Save Changes
        </button>
        <Button
          className="mt-6 bg-gray-500 hover:bg-gray-600 text-white"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </Button>
        <Button
          className="mt-6 bg-gray-500 hover:bg-gray-600 text-white"
          onClick={() => router.push("/profile")}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
