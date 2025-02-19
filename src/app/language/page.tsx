"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LanguageSelection() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    // Fetch the stored language from the API on component mount.
    const fetchLanguage = async () => {
      try {
        const res = await fetch("/api/language", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch language preference");
        const data = await res.json();
        setLanguage(data.language || "en");
      } catch (error) {
        console.error("Error fetching language:", error);
      }
    };

    fetchLanguage();
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    try {
      const res = await fetch("/api/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: newLanguage }),
      });
      if (!res.ok) throw new Error("Failed to update language preference");
      alert(`Language changed to ${newLanguage}`);
    } catch (error) {
      console.error("Error updating language:", error);
      alert("Error updating language preference");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Language Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-center">Select your preferred language:</p>
          <div className="flex items-center justify-center mt-4">
            <select
              value={language}
              onChange={handleChange}
              className="p-2 border rounded-lg"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
        </CardContent>
      </Card>
      <Button
        onClick={() => router.push("/dashboard")}
        className="mt-6 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2"
      >
        Back to Dashboard
      </Button>
    </div>
  );
}
