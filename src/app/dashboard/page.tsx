"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface Ride {
  id: string;
  from: string;
  to: string;
  time: string;
  departure_time: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id?: string;
    name?: string;
    profilePic?: string;
    email?: string;
  }>({});
  const [recentRide, setRecentRide] = useState<Ride | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setUser((prevUser) => ({
          ...prevUser,
          profilePic: data.profilePic, // Only update profilePic
        }));
      });

    loadRides();
    const fetchUserData = () => {
      let userEmail = localStorage.getItem("userEmail") ?? "";

      if (!userEmail) {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

        if (storedUser?.email) {
          userEmail = storedUser.email;
          localStorage.setItem("userEmail", userEmail);
        } else {
          router.push("/login");
          return;
        }
      }

      fetch(
        `http://localhost:5001/users/email/${encodeURIComponent(userEmail)}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.id) {
            localStorage.setItem("user", JSON.stringify(data));
            setUser(data);
            fetchRecentRide(data.id); // Fetch recent ride after getting user data
          } else {
            handleLogout();
          }
        })
        .catch((error) => console.error("Failed to fetch user:", error));
    };

    fetchUserData();
    window.addEventListener("storage", fetchUserData);

    return () => {
      window.removeEventListener("storage", fetchUserData);
    };
  }, []);

 const loadRides = () => {
    const storedRides = JSON.parse(localStorage.getItem("rides") || "[]");
    const sortedRides = storedRides.sort((a: Ride, b: Ride) => new Date(a.time).getTime() - new Date(b.time).getTime());
    setRides(sortedRides);
  };

  const fetchRecentRide = async (userId: string) => {
  try {
    const res = await fetch(
      `http://localhost:5001/rides/user/${userId}/recent`
    );

    if (!res.ok) {
      console.warn("No recent ride found or request failed.");
      setRecentRide(null); // Ensure state is cleared
      return;
    }

    const rideData = await res.json();
    if (rideData) {
      setRecentRide(rideData);
    } else {
      setRecentRide(null); // Handle case where API returns empty data
    }
  } catch (error) {
    console.error("Error fetching recent ride:", error);
    setRecentRide(null); // Ensure UI does not break
  }
};


  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  // Group dashboard actions by category
  const dashboardActions = [
    {
      category: "Rides",
      items: [
        { name: "Find a Ride", path: "/find-ride", gradient: "bg-gradient-to-r from-[#FFD700] to-[#FFA500]", textColor: "text-black", icon: "🚗" },
        { name: "Offer a Ride", path: "/offer-ride", gradient: "bg-gradient-to-r from-[#1E40AF] to-[#3B82F6]", textColor: "text-white", icon: "🚘" },
  { name: "Matching Rides", path: "/ride-matching", gradient: "bg-gradient-to-r from-[#1E40AF] to-[#3B82F6]", textColor: "text-white", icon: "🚘" },
        { name: "Estimate Cost", path: "/ride-cost", gradient: "bg-gradient-to-r from-[#1E40AF] to-[#3B82F6]", textColor: "text-white", icon: "💸" },
        { name: "View Map", path: "/map", gradient: "bg-gradient-to-r from-[#059669] to-[#10B981]", textColor: "text-white", icon: "🗺️" },
        { name: "Saved Locations", path: "/saved-locations", gradient: "bg-gradient-to-r from-[#1E40AF] to-[#3B82F6]", textColor: "text-white", icon: "📍" },
      ]
    },
    {
      category: "Community",
      items: [
        { name: "Direct Messages", path: "/messages", gradient: "bg-gradient-to-r from-[#2563EB] to-[#60A5FA]", textColor: "text-white", icon: "💬" },
  { name: "Forum", path: "/forum", gradient: "bg-gradient-to-r from-[#2563EB] to-[#60A5FA]", textColor: "text-white", icon: "💬" },
//        { name: "Ratings & Reviews", path: "/Ratings-Reviews", gradient: "bg-gradient-to-r from-[#FFD700] to-[#FFA500]", textColor: "text-black", icon: "⭐" },
        { name: "Chat Assistant", path: "/AI-Chat-Assistant", gradient: "bg-gradient-to-r from-[#1E40AF] to-[#3B82F6]", textColor: "text-white", icon: "🤖" },
        { name: "Refer a Friend", path: "/referral", gradient: "bg-gradient-to-r from-[#2563EB] to-[#60A5FA]", textColor: "text-white", icon: "👥" },
      ]
    },
    {
      category: "Account",
      items: [
        { name: "Payment", path: "/payment", gradient: "bg-gradient-to-r from-[#1E40AF] to-[#3B82F6]", textColor: "text-white", icon: "💳" },
        { name: "Input Referral Code", path: "/referral-redeem", gradient: "bg-gradient-to-r from-[#FFD700] to-[#FFA500]", textColor: "text-black", icon: "🎁" },
//        { name: "Language", path: "/language", gradient: "bg-gradient-to-r from-[#2563EB] to-[#60A5FA]", textColor: "text-white", icon: "🌐" },
//    { name: "Lighting Mode", path: "/dark-mode", gradient: "bg-gradient-to-r from-[#2563EB] to-[#60A5FA]", textColor: "text-white",},
      ]
    }
  ];

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          alert("Error getting location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#2563EB] to-[#020B3B] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white/95 backdrop-blur-sm text-gray-900 shadow-xl flex flex-col items-center p-6 rounded-r-3xl">
        <div className="relative">
          <Image
            src={user.profilePic || "/default-avatar.png"}
            alt="Profile Picture"
            width={120}
            height={120}
            className="rounded-full border-4 border-[#3B82F6]/50 shadow-lg object-cover"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
        <h2 className="text-xl font-semibold mt-4">{user.name || "User"}</h2>
        <p className="text-sm text-gray-500 mb-6">{user.email || "No email"}</p>

        {/* Sidebar Navigation */}
        <nav className="w-full space-y-3">
          <Button
            className="w-full bg-gradient-to-r from-[#0F172A] to-[#1E40AF] hover:from-[#172554] hover:to-[#2563EB] text-white shadow-md rounded-full py-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
            onClick={() => router.push("/profile")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            View Profile
          </Button>
          <Button
            className="w-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#60A5FA] text-white shadow-md rounded-full py-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
            onClick={() => router.push("/ride-history")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Ride History
          </Button>
          <Button
            className="w-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#60A5FA] text-white shadow-md rounded-full py-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
            onClick={() => router.push("/messages")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Direct Messages
          </Button>
    <Button
            className="w-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#60A5FA] text-white shadow-md rounded-full py-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
            onClick={() => router.push("/group-chat")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Group Chat
          </Button>
        </nav>
  
        {/* Emergency Contact & Logout */}
        <div className="mt-auto w-full space-y-3">
          <Button
            className="w-full bg-gradient-to-r from-[#EF4444] to-[#F87171] hover:from-[#DC2626] hover:to-[#FCA5A5] text-white shadow-md rounded-full py-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
            onClick={() => router.push("/emergency-contact")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Emergency Contact
          </Button>
          <Button
            className="w-full bg-gradient-to-r from-[#059669] to-[#10B981] hover:to-[#FCA5A5] text-white shadow-md rounded-full py-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
            onClick={getLocation}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Get Location
          </Button>
          <Button
            className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#F59E0B] hover:to-[#FBBF24] text-black shadow-md rounded-full py-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </Button>
          <Button
            className="w-full bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:from-[#B91C1C] hover:to-[#DC2626] text-white shadow-md rounded-full py-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            Delete Account
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8">
            <div className="bg-white/15 p-3 rounded-[15px] mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome, {user.name || "User"}! 👋
              </h1>
              <p className="text-md text-gray-300 mt-1">Ready for your next ride?</p>
            </div>
          </div>

          {/* Recent Ride Section */}
    
          <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl mb-8 rounded-2xl border-t border-white/50">
            <CardHeader className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white rounded-t-2xl p-6">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Your Most Recent Ride
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {recentRide ? (
                <div className="text-gray-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#3B82F6]/15 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3B82F6]">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="8 12 12 16 16 12" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                        </svg>
                      </div>
                      <span className="font-medium">{recentRide.from}</span>
                    </div>
                    <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-4 relative">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="16"></line>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="16 12 12 8 8 12" />
                          <line x1="12" y1="16" x2="12" y2="8" />
                        </svg>
                      </div>
                      <span className="font-medium">{recentRide.to}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {new Date(recentRide.departure_time).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600 py-4">
                  <div className="bg-gray-100 p-4 rounded-full inline-block mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <p>No recent rides found</p>
                  <p className="text-sm mt-1">Book your first ride today!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dashboard Actions */}
          {dashboardActions.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="h-6 w-1 bg-[#FFD700] rounded-full"></div>
                {section.category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {section.items.map((action, actionIndex) => (
                  <Button
                    key={actionIndex}
                    className={`${action.gradient} ${action.textColor} font-semibold shadow-lg rounded-xl py-4 h-auto flex flex-col items-center justify-center gap-2 transition-all hover:shadow-xl hover:scale-105`}
                    onClick={() => router.push(action.path)}
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <span>{action.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
