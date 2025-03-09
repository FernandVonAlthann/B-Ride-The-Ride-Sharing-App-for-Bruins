"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  // const validateEmail = (email: string): boolean => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };
  
  // const validatePassword = (password: string): boolean => {
  //   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  //   return passwordRegex.test(password);
  // };

  const handleSignup = async () => {


    // if (!validateEmail(email)) {
    //   newErrors.email = "Invalid email format. Please enter a valid email.";
    // }
    
    // if (!validatePassword(password)) {
    //   newErrors.password = "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.";
    // }
    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Signup successful! Redirecting to login.");
        router.push("/login");
      } else {
        alert(data.error || "Signup failed.");
      }
    } catch (err) {
      alert("Error signing up. Please try again.");
    }
  };
  

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] text-white">
      <header className="fixed top-0 left-0 right-0 z-10 flex justify-center px-6 py-4">
        <div className="w-full max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
            <Image src="/logo.png" alt="B-Ride Logo" width={32} height={32} className="rounded-xl" />
            <span className="text-xl font-bold text-white">B-Ride</span>
          </div>
        </div>
      </header>

      <div className="min-h-screen px-6 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-12 w-full max-w-5xl">
          <div className="hidden lg:block">
            <Image src="/logo.png" alt="B-Ride Logo" width={400} height={400} className="opacity-75" priority />
          </div>
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-white">Join the B-Ride Community</CardTitle>
              <p className="text-center text-gray-200 mt-2">Connect with fellow students for safe, affordable, and fun campus commutes.</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/20 border-white/20 text-white placeholder:text-white/70 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/20 border-white/20 text-white placeholder:text-white/70 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/20 border-white/20 text-white placeholder:text-white/70 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                </div>

                <Button
                  className="w-full bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-full text-lg font-semibold transition"
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>

                <div className="text-center text-white space-y-4 mt-6">
                  <p>Already have an account?</p>
                  <Button
                    className="w-full bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2563eb] hover:opacity-90 text-white border-0 px-8 py-3 rounded-full text-lg font-semibold transition"
                    onClick={() => router.push("/login")}
                  >
                    Login
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
