"use client";

import { useState } from "react";
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
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Save user info and token
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
  
        alert("Login successful! Redirecting...");
        router.push("/dashboard");
      } else {
        alert(data.error || "Login failed.");
      }
    } catch (err) {
      alert("Error logging in. Please try again.");
    }
  };
  

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] text-white">
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 right-0 z-10 flex justify-center px-6 py-4">
        <div className="w-full max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
            <Image
              src="/logo.png"
              alt="B-Ride Logo"
              width={32}
              height={32}
              className="rounded-xl"
            />
            <span className="text-xl font-bold text-white">B-Ride</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen px-6 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-12 w-full max-w-5xl">
          <div className="hidden lg:block">
            <Image
              src="/logo.png"
              alt="B-Ride Logo"
              width={400}
              height={400}
              className="opacity-75"
              priority
            />
          </div>
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-white">Welcome Back!</CardTitle>
              <p className="text-center text-gray-200 mt-2">Ready for your next ride? Sign in and hit the road with fellow Bruins.</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input 
                  type="email" 
                  placeholder="Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/20 border-white/20 text-white placeholder:text-white/70 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/20 border-white/20 text-white placeholder:text-white/70 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Button 
                  className="w-full bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-full text-lg font-semibold transition"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <div className="text-center text-white space-y-4 mt-6">
                  <p>Don&apos;t have an account?</p>
                  <Button
                    className="w-full bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2563eb] hover:opacity-90 text-white border-0 px-8 py-3 rounded-full text-lg font-semibold transition"
                    onClick={handleSignup}
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
