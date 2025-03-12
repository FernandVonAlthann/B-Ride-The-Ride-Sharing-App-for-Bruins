"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function EmergencyContactPage() {
  const router = useRouter();
  const [contact, setContact] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
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
    setIsSaving(true);
    try {
      const res = await fetch("/api/emergency-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emergencyContact: contact }),
      });
      if (!res.ok) throw new Error("Failed to save emergency contact");

      setNotification({ show: true, message: "Emergency contact saved!" });
      setTimeout(() => setNotification({ show: false, message: "" }), 3000);
    } catch (error) {
      console.error("Error saving emergency contact:", error);
      alert("Error saving emergency contact");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] p-6 flex flex-col items-center justify-center">
      {notification.show && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {notification.message}
        </div>
      )}

      <Card className="w-full max-w-lg bg-white/90 shadow-xl rounded-2xl border-t border-white/50">
        <CardHeader className="bg-gradient-to-r from-[#4D9FFF] to-[#2563EB] text-white rounded-t-2xl p-6">
          <CardTitle className="text-center text-2xl font-bold">
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">
              Phone Number:
            </label>
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-[#4D9FFF]"
            />
          </div>

          <Button
            className="w-full bg-[#E6B400] text-black font-medium py-3 rounded-full shadow-md"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Contact"}
          </Button>

          <Button
            className="w-full bg-[#172554] text-white font-medium py-3 rounded-full shadow-md"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

