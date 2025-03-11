"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Preferences {
  language?: string;
  ridePreference?: string;
}

interface User {
  id?: string;
  name: string;
  email: string;
  bio: string;
  profilePic: string;
  preferences: Preferences;
  rating?: number;
  ridesTaken?: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    id: "",
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
    const fetchUserProfile = () => {
      const userEmail = localStorage.getItem("userEmail");

      if (!userEmail) {
        console.error("No user email found in localStorage");
        return;
      }

      fetch(`http://localhost:5001/users/email/${userEmail}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            const updatedUser = {
              id: data.id,
              name: data.name,
              email: data.email,
              bio: data.bio || "No bio set",
              profilePic: data.profile_picture || "/default-avatar.png",
              preferences: {
                language: data.language || "English",
                ridePreference: data.ride_preference || "Comfort",
              },
              rating: data.rating ?? "N/A",
              ridesTaken: data.rides_taken ?? 0,
            };

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.dispatchEvent(new Event("storage"));
          }
        })
        .catch((error) => console.error("Failed to fetch profile:", error));
    };

    fetchUserProfile();
    window.addEventListener("storage", fetchUserProfile);

    return () => {
      window.removeEventListener("storage", fetchUserProfile);
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#3268B7] to-[#1A437A] p-6">
      <div className="relative w-full max-w-md bg-white shadow-lg rounded-lg text-center pb-6">
        <div className="bg-gradient-to-r from-[#3268B7] to-[#1A437A] h-28 rounded-t-lg"></div>

        <div className="relative -top-10 flex justify-center">
          <Image
            src={user.profilePic || "/default-avatar.png"}
            alt="Profile Picture"
            width={90}
            height={90}
            className="rounded-full border-4 border-white shadow-md"
          />
        </div>

        <h1 className="text-xl font-bold text-black mt-2">{user.name || "N/A"}</h1>
        <p className="text-sm text-gray-600 px-4">{user.bio || "No bio set"}</p>

        <div className="flex justify-around mt-4 px-6 text-gray-700">
          <div className="text-center">
            <p className="text-lg font-semibold">{user.ridesTaken || 0}</p>
            <p className="text-sm">Rides Taken</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{user.rating ? user.rating.toFixed(1) : "N/A"}</p>
            <p className="text-sm">Rating</p>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-700">
          <p>
            <strong>Language:</strong> {user.preferences.language || "English"}
          </p>
          <p>
            <strong>Ride Preference:</strong> {user.preferences.ridePreference || "Comfort"}
          </p>
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <button className="px-6 py-1.5 bg-gradient-to-r from-[#172554] to-[#2563eb] text-white shadow-md rounded-full" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </button>
          <button className="px-6 py-1.5 bg-gradient-to-r from-[#172554] to-[#2563eb] text-white shadow-md rounded-full" onClick={() => router.push("/profileapp")}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
