"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface SavedLocation {
  id: number;
  location_name: string;
  created_at: string;
}

export default function SavedLocations() {
  const router = useRouter();
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/saved-locations");
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
      } else {
        console.error("Failed to fetch saved locations");
      }
    } catch (error) {
      console.error("Error fetching saved locations:", error);
    }
  };

  const addLocation = async () => {
    if (newLocation.trim() === "") return;
    // Using a dummy user_id; replace with the actual user's id if available
    const locationPayload = {
      user_id: 1,
      location_name: newLocation.trim(),
    };

    try {
      const res = await fetch("/api/saved-locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationPayload),
      });
      if (res.ok) {
        const savedLocation = await res.json();
        // Add the new location at the beginning of the list
        setLocations([savedLocation, ...locations]);
        setNewLocation("");
      } else {
        console.error("Failed to add location");
      }
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const removeLocation = async (id: number) => {
    try {
      const res = await fetch(`/api/saved-locations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLocations(locations.filter((loc) => loc.id !== id));
      } else {
        console.error("Failed to remove location");
      }
    } catch (error) {
      console.error("Error removing location:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addLocation();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] p-6 flex flex-col">
      {/* Back to Dashboard Button */}
      <Button 
        className="self-start mb-6 bg-[#172554] hover:bg-[#1E3A8A] text-white shadow-md rounded-full px-6 py-2 flex items-center gap-2"
        onClick={() => router.push("/dashboard")}
      >
        ← Back to Dashboard
      </Button>

      <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm text-gray-900 shadow-xl rounded-2xl border-t border-white/50">
        <CardHeader className="bg-gradient-to-r from-[#4D9FFF] to-[#2563EB] text-white rounded-t-2xl p-6">
          <CardTitle className="text-center text-2xl font-bold">
            Saved Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="Enter a location" 
                value={newLocation} 
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4D9FFF]"
              />
              <Button 
                className="bg-[#E6B400] hover:bg-[#D9A900] text-black font-semibold px-6 py-3 rounded-full"
                onClick={addLocation}
              >
                Save
              </Button>
            </div>
            
            <div className="mt-6 space-y-3">
              {locations.length > 0 ? (
                locations.map((loc) => (
                  <div key={loc.id} className="flex justify-between items-center bg-white/20 p-4 rounded-xl border border-white/10 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#4D9FFF]/20 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D9FFF]">
                          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-800">{loc.location_name}</span>
                    </div>
                    <Button
                      className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm"
                      onClick={() => removeLocation(loc.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-white/10 rounded-xl border border-white/10">
                  <div className="flex justify-center mb-4">
                    <div className="bg-[#4D9FFF]/20 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D9FFF]">
                        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600">No saved locations yet.</p>
                  <p className="text-gray-500 text-sm mt-2">Add your favorite places for quick access.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
