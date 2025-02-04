"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome, {user.name || "User"}!</h1>
      <p className="text-lg">You're now logged in.</p>
      <Button 
        className="mt-4 bg-red-600 hover:bg-red-700 text-white"
        onClick={() => {
          localStorage.removeItem("user"); // Logout action
          router.push("/");
        }}
      >
        Logout
      </Button>
    </div>
  );
}
