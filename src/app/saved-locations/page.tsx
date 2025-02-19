
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SavedLocations() {
  const router = useRouter();
  const [locations, setLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:5001/locations", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch saved locations");

        const data = await res.json();
        setLocations(data.locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const addLocation = async () => {
    if (newLocation.trim() === "") return;

    try {
      const res = await fetch("http://localhost:5001/locations", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: newLocation }),
      });

      if (!res.ok) throw new Error("Failed to save location");

      setLocations([...locations, newLocation]);
      setNewLocation("");
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const removeLocation = async (index: number) => {
    const locationToRemove = locations[index];

    try {
      const res = await fetch("http://localhost:5001/locations", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: locationToRemove }),
      });

      if (!res.ok) throw new Error("Failed to remove location");

      setLocations(locations.filter((_, i) => i !== index));
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
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : locations.length > 0 ? (
                locations.map((loc, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-200 p-2 rounded">
                    <span>{loc}</span>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-sm"
                      onClick={() => removeLocation(index)}
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
