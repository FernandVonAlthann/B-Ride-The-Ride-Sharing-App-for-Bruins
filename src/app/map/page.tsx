"use client";

import { useRouter } from "next/navigation";
import Map from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function MapPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] p-6 flex flex-col">
      {/* Back to Dashboard Button */}
      <Button 
        className="self-start mb-6 bg-[#172554] hover:bg-[#1E3A8A] text-white shadow-md rounded-full px-6 py-2 flex items-center gap-2"
        onClick={() => router.push("/dashboard")}
      >
        ← Back to Dashboard
      </Button>

      <Card className="w-full max-w-5xl mx-auto bg-white/90 backdrop-blur-sm text-gray-900 shadow-xl rounded-2xl border-t border-white/50">
        <CardHeader className="bg-gradient-to-r from-[#4D9FFF] to-[#2563EB] text-white rounded-t-2xl p-6">
          <CardTitle className="text-center text-2xl font-bold">
            Live Map
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-gray-600">
                View real-time locations of B-Ride users in your area
              </p>
            </div>
            
            <div className="w-full h-[60vh] rounded-xl overflow-hidden border border-gray-200 shadow-md">
              <Map />
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="text-yellow-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800">Location Privacy</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Your location is only shared while you have the app open. You can disable location sharing in your device settings at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
