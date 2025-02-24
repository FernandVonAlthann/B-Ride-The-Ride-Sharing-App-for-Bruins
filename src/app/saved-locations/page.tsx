"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Saved Locations</h1>
      <Card className="w-full max-w-md bg-white text-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Manage Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input 
              type="text" 
              placeholder="Enter a location" 
              value={newLocation} 
              onChange={(e) => setNewLocation(e.target.value)}
            />
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={addLocation}>
              Save Location
            </Button>
            <div className="mt-4 space-y-2">
              {locations.length > 0 ? (
                locations.map((loc) => (
                  <div key={loc.id} className="flex justify-between items-center bg-gray-200 p-2 rounded">
                    <span>{loc.location_name}</span>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-sm"
                      onClick={() => removeLocation(loc.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No saved locations yet.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Button className="mt-6 bg-gray-500 hover:bg-gray-600 text-white" onClick={() => router.push("/dashboard")}>
        Back to Dashboard
      </Button>
    </div>
  );
}
