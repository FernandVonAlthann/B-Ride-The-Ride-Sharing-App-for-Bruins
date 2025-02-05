"use client";

import { useRouter } from "next/navigation";
import Map from "@/components/Map";
import { Button } from "@/components/ui/button";

export default function MapPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Live User Locations</h1>
      <div className="w-full max-w-4xl h-[500px] mb-4">
        <Map />
      </div>
      <Button onClick={() => router.push("/dashboard")} className="bg-gray-500 hover:bg-gray-600 text-white">
          Go Back
        </Button>
    </div>
  );
}
