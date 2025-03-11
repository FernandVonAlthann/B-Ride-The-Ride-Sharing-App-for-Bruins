"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    bio: "",
    profilePic: "/default-avatar.png",
    preferences: {
      language: "",
      ridePreference: "",
    },
  });

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      console.error("No user email found in localStorage");
      return;
    }

    fetch(`http://localhost:5001/users/email/${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setUser({
            id: data.id,
            name: data.name,
            email: data.email,
            bio: data.bio || "",
            profilePic: data.profile_picture || "/default-avatar.png",
            preferences: {
              language: data.language || "",
              ridePreference: data.ride_preference || "",
            },
          });

          // Store correct user data in localStorage
          localStorage.setItem("user", JSON.stringify(data));
          window.dispatchEvent(new Event("storage")); // Notify all pages
        } else {
          console.error("User data not found");
        }
      })
      .catch((error) => console.error("Failed to fetch profile:", error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.id) {
      alert("Error: User ID is missing. Try refreshing the page.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/users/update/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          bio: user.bio,
          language: user.preferences.language,
          ride_preference: user.preferences.ridePreference,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = { ...user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("storage")); // Update all pages

      alert("Profile updated successfully!");
      router.push("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#3268B7] to-[#1A437A] p-6">
      <div className="relative w-full max-w-md bg-white shadow-lg rounded-lg text-center pb-6">
        <div className="bg-gradient-to-r from-[#3268B7] to-[#1A437A] h-28 rounded-t-lg"></div>

        <div className="relative -top-10 flex justify-center">
          <img
            src={user.profilePic || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
          />
        </div>

        <h1 className="text-2xl font-bold text-black mt-2">Edit Your Profile</h1>

        <form onSubmit={handleSubmit} className="p-6 text-black">
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3 text-black placeholder-gray-500"
            placeholder="Enter your name"
          />
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3 text-black placeholder-gray-500"
            placeholder="Enter your bio"
          />
          <input
            type="text"
            name="language"
            value={user.preferences.language}
            onChange={(e) => setUser((prev) => ({ ...prev, preferences: { ...prev.preferences, language: e.target.value } }))}
            className="w-full p-2 border rounded mb-3 text-black placeholder-gray-500"
            placeholder="Preferred Language"
          />
          <input
            type="text"
            name="ridePreference"
            value={user.preferences.ridePreference}
            onChange={(e) => setUser((prev) => ({ ...prev, preferences: { ...prev.preferences, ridePreference: e.target.value } }))}
            className="w-full p-2 border rounded mb-3 text-black placeholder-gray-500"
            placeholder="Ride Preference"
          />

          <div className="mt-4 flex justify-center gap-3">
            <button
              type="submit"
              className="px-5 py-1 bg-gradient-to-r from-[#172554] to-[#2563eb] hover:opacity-90 text-white shadow-md rounded-full text-sm font-medium w-auto"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="px-5 py-1 bg-gradient-to-r from-[#172554] to-[#2563eb] hover:opacity-90 text-white shadow-md rounded-full text-sm font-medium w-auto"
              onClick={() => router.push("/profile")}
            >
              Back to Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
