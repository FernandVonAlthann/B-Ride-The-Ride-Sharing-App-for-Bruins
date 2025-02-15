"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black p-6">
      <Card className="w-full max-w-lg bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg"><strong>Name:</strong> {user.name || "N/A"}</p>
          <p className="text-lg"><strong>Email:</strong> {user.email || "N/A"}</p>
        </CardContent>
      </Card>

      <Button 
        className="mt-6 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 text-lg" 
        onClick={() => router.push("/dashboard")}
      >
        Back to Dashboard
      </Button>
    </div>
  );
}
