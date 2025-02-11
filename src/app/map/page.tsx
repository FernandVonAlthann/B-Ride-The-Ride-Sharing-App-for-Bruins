"use client";

import { useRouter } from "next/navigation";
import "./globals.css";
import Map from "@/components/Map";
import { Button } from "@/components/ui/button";

export default function MapPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Live User Locations</h1>
      <div className="w-[50vw] h-[50vh] rounded-md shadow-md">
      	   <Map />
      </div>
      <Button onClick={() => router.push("/dashboard")} className="bg-gray-500 hover:bg-gray-600 text-white">
          Go Back
        </Button>
    </div>
  );
}
