"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function EmergencyContactPage() {
  const router = useRouter();
  const [contact, setContact] = useState("");

  useEffect(() => {
    // Fetch emergency contact from the API
    fetchEmergencyContact();
  }, []);

  const fetchEmergencyContact = async () => {
    try {
      const res = await fetch("/api/emergency-contact", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch emergency contact");
      const data = await res.json();
      setContact(data.emergencyContact || "");
    } catch (error) {
      console.error("Error fetching emergency contact:", error);
    }
  };

  const handleSave = async () => {
    if (!contact.trim()) {
      alert("Please enter a valid phone number.");
      return;
    }
    try {
      const res = await fetch("/api/emergency-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emergencyContact: contact }),
      });
      if (!res.ok) throw new Error("Failed to save emergency contact");
      alert("Emergency contact saved!");
    } catch (error) {
      console.error("Error saving emergency contact:", error);
      alert("Error saving emergency contact");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <label className="text-lg font-semibold">Phone Number:</label>
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleSave}
            >
              Save Contact
            </Button>
            <Button
              className="w-full bg-gray-500 hover:bg-gray-600 text-white"
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
