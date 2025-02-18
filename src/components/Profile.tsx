"use client";

import { useEffect, useState } from "react";

export default function Profile({ userId }: { userId: string }) {
  const [profile, setProfile] = useState({ name: "", bio: "", profilePic: "", ridePreferences: [] });
  const [updatedProfile, setUpdatedProfile] = useState(profile);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`/api/profile?userId=${userId}`);
      const data = await response.json();
      if (!data.error) {
        setProfile(data);
        setUpdatedProfile(data);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleUpdateProfile = async () => {
    await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify({ userId, ...updatedProfile }),
      headers: { "Content-Type": "application/json" },
    });

    setProfile(updatedProfile);
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold mb-4">Profile Customization</h2>
      <img src={profile.profilePic || "/default-avatar.png"} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
      <input
        type="text"
        placeholder="Profile Picture URL"
        value={updatedProfile.profilePic}
        onChange={(e) => setUpdatedProfile({ ...updatedProfile, profilePic: e.target.value })}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Name"
        value={updatedProfile.name}
        onChange={(e) => setUpdatedProfile({ ...updatedProfile, name: e.target.value })}
        className="border p-2 mb-2 w-full"
      />
      <textarea
        placeholder="Bio"
        value={updatedProfile.bio}
        onChange={(e) => setUpdatedProfile({ ...updatedProfile, bio: e.target.value })}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Ride Preferences (comma-separated)"
        value={updatedProfile.ridePreferences.join(", ")}
        onChange={(e) => setUpdatedProfile({ ...updatedProfile, ridePreferences: e.target.value.split(",") })}
        className="border p-2 mb-2 w-full"
      />
      <button onClick={handleUpdateProfile} className="bg-blue-500 text-white p-2 rounded-md">
        Save Profile
      </button>
    </div>
  );
}
