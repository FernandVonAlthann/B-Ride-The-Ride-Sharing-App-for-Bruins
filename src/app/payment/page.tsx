"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function PaymentPage() {
  const router = useRouter();

  // This function simulates redirecting to Venmo.
  const handleRedirectToVenmo = () => {
    // Redirect to Venmo's website
    window.location.href = "https://venmo.com/";
  };

  // This function simulates redirecting to Zelle.
  const handleRedirectToZelle = () => {
    // Redirect to Zelle's website
    window.location.href = "https://www.zellepay.com/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] p-6 flex flex-col">
      {/* Back to Dashboard Button */}
      <Button 
        className="self-start mb-6 bg-[#172554] hover:bg-[#1E3A8A] text-white shadow-md rounded-full px-6 py-2 flex items-center gap-2"
        onClick={() => router.push("/dashboard")}
      >
        ← Back to Dashboard
      </Button>

      <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm text-gray-900 shadow-xl rounded-2xl border-t border-white/50">
        <CardHeader className="bg-gradient-to-r from-[#4D9FFF] to-[#2563EB] text-white rounded-t-2xl p-6">
          <CardTitle className="text-center text-2xl font-bold">
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <p className="text-center text-gray-700 mb-6">
              Choose your preferred payment method to complete your transaction.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Venmo Option */}
              <div className="bg-white/30 p-5 rounded-xl border border-white/20 hover:shadow-md transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#3D95CE]/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3D95CE]">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Venmo</h3>
                  <p className="text-gray-600 text-sm mb-4">Fast and secure payments between friends</p>
                  <Button
                    onClick={handleRedirectToVenmo}
                    className="bg-[#3D95CE] hover:bg-[#3D95CE]/80 text-white px-6 py-2 rounded-full"
                  >
                    Pay with Venmo
                  </Button>
                </div>
              </div>
              
              {/* Zelle Option */}
              <div className="bg-white/30 p-5 rounded-xl border border-white/20 hover:shadow-md transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#6B1CD3]/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6B1CD3]">
                      <path d="M2 9V5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v4" />
                      <path d="M2 13v6c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-6" />
                      <path d="M5 8h14" />
                      <path d="M5 16h14" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Zelle</h3>
                  <p className="text-gray-600 text-sm mb-4">Send money directly to bank accounts</p>
                  <Button
                    onClick={handleRedirectToZelle}
                    className="bg-[#6B1CD3] hover:bg-[#6B1CD3]/80 text-white px-6 py-2 rounded-full"
                  >
                    Pay with Zelle
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="text-yellow-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-800">Important Note</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    For security reasons, please verify the recipient's information before completing your payment. B-Ride is not responsible for payments sent to incorrect accounts.
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
