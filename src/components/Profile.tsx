"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    profilePic: "/default-avatar.png",
    preferences: {
      darkMode: false,
      language: "English",
      ridePreference: "Comfort",
    },
  });
  const [loading, setLoading] = useState(true);

  // Load profile from database
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5001/profile", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile(data.profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile picture upload
  const handleProfilePicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePic", file);

      try {
        const res = await fetch("http://localhost:5001/profile/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!res.ok) throw new Error("Failed to upload profile picture");

        const data = await res.json();
        setProfile((prev) => ({ ...prev, profilePic: data.profilePic }));
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
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

  // Save profile to database
  const saveProfile = async () => {
    try {
      const res = await fetch("http://localhost:5001/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      alert("Profile saved!");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Edit Your Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-[400px] text-center">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
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
            <label className="block font-semibold text-left">Name</label>
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

            {/* Dark Mode Toggle */}
            <label className="flex items-center justify-between">
              <span>Dark Mode</span>
              <input
                type="checkbox"
                checked={profile.preferences.darkMode}
                onChange={(e) => handlePreferenceChange("darkMode", e.target.checked)}
                className="ml-2"
              />
            </label>

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
            <button onClick={saveProfile} className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4">
              Save Changes
            </button>
            <Button className="mt-6 bg-gray-500 hover:bg-gray-600 text-white" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button className="mt-6 bg-gray-500 hover:bg-gray-600 text-white" onClick={() => router.push("/profile")}>
              Back
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
