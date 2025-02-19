"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  // Navigation handlers
  const handleLogin = () => router.push("/login");
  const handleSignup = () => router.push("/signup");

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] text-white">
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 right-0 z-10 flex justify-center px-6 py-4">
        <div className="w-full max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="B-Ride Logo"
              width={32}
              height={32}
              className="rounded-xl"
            />
            <span className="text-xl font-bold text-white">B-Ride</span>
          </div>
          <button
            onClick={handleLogin}
            className="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-full text-sm font-medium transition"
          >
            Login
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen px-6 flex flex-col justify-start pt-24">
        <div className="w-full max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Hit the Road<br />Share the Cost<br />Make Friends
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-gray-200 leading-relaxed max-w-lg">
              B-Ride connects you with fellow students for safe, affordable, and fun campus commutes. Join now and enjoy stress-free travel—together!
            </p>
          </div>

          {/* Hero Image */}
          <div className="lg:w-7/12 mb-8 lg:mb-0">
            <div className="relative w-full">
              <Image
                src="/hero-image.png"
                alt="B-Ride Hero Illustration"
                width={640}
                height={640}
                className="rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="w-full max-w-md mx-auto mt-8 lg:mt-12 mb-8 px-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleSignup}
              className="w-full bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-full text-lg font-semibold transition"
            >
              Sign Up
            </button>
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2563eb] hover:opacity-90 text-white border-0 px-8 py-3 rounded-full text-lg font-semibold transition"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
