"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (name && email && password) {
      const user = { name, email, password };
      localStorage.setItem("user", JSON.stringify(user));
      alert("Account created! You can now log in.");
      router.push("/");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">B-Ride</h1>
      <Card className="w-96 shadow-xl bg-white text-gray-800">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input 
              type="text" 
              placeholder="Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />
            <Input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleSignup}>Create Account</Button>
            <div className="text-center text-sm text-gray-600 mt-2">
              Already have an account? 
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push("/")}> Log in</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
