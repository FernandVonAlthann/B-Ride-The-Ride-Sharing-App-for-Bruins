"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PaymentPage() {
  const router = useRouter();

  // This function simulates redirecting to Venmo.
  const handleRedirectToVenmo = () => {
    // Redirect to Venmo's website
    window.location.href = "https://venmo.com/";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Payment</h1>
      <p className="mb-4">
        Please complete your payment using Venmo or Zelle.
      </p>
      <Button
        onClick={handleRedirectToVenmo}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
      >
        Proceed to Venmo
      </Button>
      <Button
        onClick={() => router.push("/dashboard")}
        className="mt-6 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2"
      >
        Back to Dashboard
      </Button>
    </div>
  );
}
