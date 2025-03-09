"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState({
    id: "", // Ensure ID is included
    name: "",
    email: "",
    bio: "",
    profilePic: "",
    preferences: {
      language: "",
      ridePreference: "",
    },
  });

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || "k"; 

    fetch(`http://localhost:5001/users/email/${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        setUser({
          id: data.id, // Store user ID
          name: data.name,
          email: data.email,
          bio: data.bio || "",
          profilePic: data.profile_picture || "/default-avatar.png",
          preferences: {
            language: data.language || "",
            ridePreference: data.ride_preference || "",
          },
        });
      })
      .catch((error) => console.error("Failed to fetch profile:", error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = user.id;
    if (!userId) {
      alert("Invalid user ID");
      return;
    }

    console.log("Sending update request for user ID:", userId);
    console.log("Update Data:", {
      name: user.name,
      bio: user.bio,
      language: user.preferences.language,
      ride_preference: user.preferences.ridePreference,
    });

    try {
      const response = await fetch(`http://localhost:5001/users/update/${userId}`, {
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
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully!");
      router.push("/profile"); // Redirect to profile page
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#3268B7] to-[#1A437A] p-6">
      <div className="relative w-full max-w-md bg-white shadow-lg rounded-lg text-center pb-6">
        <div className="bg-gradient-to-r from-[#3268B7] to-[#1A437A] h-28 rounded-t-lg"></div>

        <div className="relative -top-10 flex justify-center">
          <img src={user.profilePic && user.profilePic !== "" ? user.profilePic : "/default-avatar.png"} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
        </div>

        <h1 className="text-2xl font-bold text-black mt-2">Edit Your Profile</h1>

        <form onSubmit={handleSubmit} className="p-6 text-black">
          <input type="text" name="name" value={user.name} onChange={handleChange} className="w-full p-2 border rounded mb-3 text-black placeholder-gray-500" placeholder="Enter your name" />
          <textarea name="bio" value={user.bio} onChange={handleChange} className="w-full p-2 border rounded mb-3 text-black placeholder-gray-500" placeholder="Enter your bio"></textarea>
          <input type="text" name="language" value={user.preferences.language} onChange={(e) => setUser((prev) => ({ ...prev, preferences: { ...prev.preferences, language: e.target.value } }))} className="w-full p-2 border rounded mb-3 text-black placeholder-gray-500" placeholder="Preferred Language" />
          <input type="text" name="ridePreference" value={user.preferences.ridePreference} onChange={(e) => setUser((prev) => ({ ...prev, preferences: { ...prev.preferences, ridePreference: e.target.value } }))} className="w-full p-2 border rounded mb-3 text-black placeholder-gray-500" placeholder="Ride Preference" />

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
