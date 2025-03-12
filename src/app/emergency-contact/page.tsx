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
    // Load emergency contact from localStorage
    const savedContact = localStorage.getItem("emergencyContact");
    if (savedContact) setContact(savedContact);
  }, []);

  const handleSave = () => {
    if (!contact.trim()) {
      alert("Please enter a valid phone number.");
      return;
    }

    localStorage.setItem("emergencyContact", contact);
    alert("Emergency contact saved!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] p-6 flex flex-col items-center justify-center">
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
              className="w-full bg-[#E6B400] text-black font-medium py-3 rounded-full shadow-md"
              onClick={handleSave}
            >
              Save Contact
            </Button>
             <Button
            className="w-full bg-[#172554] text-white font-medium py-3 rounded-full shadow-md"
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
