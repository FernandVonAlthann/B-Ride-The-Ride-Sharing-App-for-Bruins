"use client";

import { useState } from "react";
import "./globals.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = () => {
      router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
    
{/* Logo at the Top */}
      <Image src="/logo.png" alt="B-Ride Logo" width={300} height={300} className="mb-4" />
      
      <h1 className="text-4xl font-bold mb-6">B-Ride</h1>
      <Card className="w-96 shadow-xl bg-gray-100 text-gray-800">
        <CardContent>
          <div className="space-y-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleLogin}>
	    	    Login
	    </Button>
            <div className="text-center text-sm text-gray-600 mt-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white"  onClick={handleSignup}>
	    	     Sign up
	    </Button>
            </div>
          </div>
        </CardContent>
      </Card>

{/* About B-Ride */}
      <p className="mt-6 text-center text-lg max-w-md">
        <strong>B-Ride landing page</strong>
      </p>

    </div>
  );
}
