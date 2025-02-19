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
    // Load saved emergency contact
    const savedContact = localStorage.getItem("emergencyContact") || "";
    setContact(savedContact);
  }, []);

  const handleSave = async () => {
    if (!contact) {
      alert("Please enter a valid phone number.");
      return;
    }

    const res = await fetch("http://localhost:5001/emergencyContact/add",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(contact)
    });
    alert("Emergency contact saved!");
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
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSave}>
              Save Contact
            </Button>
            <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
