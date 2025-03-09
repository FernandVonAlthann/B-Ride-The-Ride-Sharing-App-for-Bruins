// "use client";

// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useEffect, useState } from "react";
// import Image from "next/image";

// interface Ride {
//   from: string;
//   to: string;
//   time: string;
// }

// export default function Dashboard() {
//   const router = useRouter();
//   const [user, setUser] = useState<{ name?: string; profilePic?: string; email?: string }>({});
//   const [rides, setRides] = useState<Ride[]>([]);

//   useEffect(() => {
//     // Retrieve user info
//     const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//     setUser(storedUser);

//     // Retrieve and sort rides
//     loadRides();
//   }, []);

//   const loadRides = () => {
//     const storedRides = JSON.parse(localStorage.getItem("rides") || "[]");
//     const sortedRides = storedRides.sort((a: Ride, b: Ride) => new Date(a.time).getTime() - new Date(b.time).getTime());
//     setRides(sortedRides);
//   };

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-[#4D9FFF] to-[#020B3B] text-white">
//       {/* Sidebar */}
//       <aside className="w-72 bg-white text-gray-900 shadow-2xl flex flex-col items-center p-8 rounded-r-3xl">
//         {/* Profile Picture */}
//         <Image
//           src={user.profilePic || "/default-avatar.png"}
//           alt="Profile Picture"
//           width={90}
//           height={90}
//           className="rounded-full border-4 border-gray-300 shadow-lg"
//         />
//         <h2 className="text-xl font-bold mt-3">{user.name || "User"}</h2>
//         <p className="text-sm text-gray-500">{user.email || "No email"}</p>

//         {/* Sidebar Navigation */}
//         <nav className="mt-6 w-full space-y-3">
//           <Button className="w-full bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2563eb] hover:opacity-90 text-white shadow-lg rounded-full" onClick={() => router.push("/profile")}>
//             View Profile
//           </Button>
//           <Button className="w-full bg-gradient-to-r from-[#4D9FFF] to-[#1E3A8A] hover:opacity-90 text-white shadow-lg rounded-full" onClick={() => router.push("/ride-history")}>
//             Ride History
//           </Button>
//           <Button className="w-full bg-gradient-to-r from-[#FFC107] to-[#FFDC5F] hover:opacity-90 text-black shadow-lg rounded-full" onClick={() => router.push("/settings")}>
//             Settings
//           </Button>
//           <Button className="w-full bg-red-500 hover:bg-red-600 text-white shadow-lg rounded-full" onClick={() => router.push("/emergency-contact")}>
//             🚨 Emergency Contact
//           </Button>
//           <Button className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg rounded-full" onClick={() => router.push("/logout")}>
//             Logout
//           </Button>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 p-10">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-5xl font-extrabold">Welcome, {user.name || "Bruin"}! 🚗</h1>
//         </div>
//         <p className="text-lg text-gray-200 mt-2">Ready to ride?</p>

//         {/* Quick Action Buttons */}
//         <div className="grid grid-cols-2 gap-6 mt-8">
//           <Button className="bg-[#FFDC5F] hover:bg-[#FFC107] text-black text-lg font-semibold shadow-xl rounded-full" onClick={() => router.push("/find-ride")}>
//             Find a Ride
//           </Button>
//           <Button className="bg-[#2563eb] hover:bg-[#1E3A8A] text-white text-lg font-semibold shadow-xl rounded-full" onClick={() => router.push("/offer-ride")}>
//             Offer a Ride
//           </Button>
//           <Button className="bg-[#4D9FFF] hover:bg-[#2563eb] text-white text-lg font-semibold shadow-xl rounded-full" onClick={() => router.push("/forum")}>
//             Forum
//           </Button>
//           <Button className="bg-[#FFDC5F] hover:bg-[#FFC107] text-black text-lg font-semibold shadow-xl rounded-full" onClick={() => router.push("/messages")}>
//             Direct Messages
//           </Button>
//           <Button className="col-span-2 bg-[#172554] hover:bg-[#1E3A8A] text-white text-lg font-semibold shadow-xl rounded-full" onClick={() => router.push("/map")}>
//             View Map
//           </Button>
//           <Button className="col-span-2 bg-[#1E3A8A] hover:bg-[#2563eb] text-white text-lg font-semibold shadow-xl rounded-full" onClick={() => router.push("/AI-Chat-Assistant")}>
//             Chat With An Assistant
//           </Button>
//         </div>

//         {/* Upcoming Rides Section */}
//         <Card className="w-full max-w-2xl bg-white text-gray-800 shadow-lg mt-10 rounded-3xl">
//           <CardHeader>
//             <CardTitle className="text-center text-2xl font-bold">Upcoming Rides</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {rides.length > 0 ? (
//               rides.map((ride, index) => (
//                 <div key={index} className="border-b pb-2 flex justify-between items-center">
//                   <div>
//                     <p className="text-lg font-semibold">{ride.from} → {ride.to}</p>
//                     <p className="text-sm text-gray-500">{new Date(ride.time).toLocaleString()}</p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">No upcoming rides</p>
//             )}
//           </CardContent>
//         </Card>

//         {/* Additional Options */}
//         <div className="grid grid-cols-2 gap-6 mt-10">
//           <Button className="bg-[#FFC107] hover:bg-[#FFDC5F] text-black text-lg font-semibold shadow-xl rounded-full" onClick={() => router.push("/ride-matching")}>
//             Live Matchmaking
//           </Button>
//           <Button className="bg-[#2563eb] hover:bg-[#1E3A8A] text-white text-lg font-semibold shadow-xl rounded-full" onClick={() => router.push("/group-chat")}>
//             Group Chat
//           </Button>
//           <Button className="bg-[#FFDC5F] hover:bg-[#FFC107] text-black text-lg font-semibold shadow-xl rounded-full" onClick={() => router.push("/ride-cost")}>
//             Estimate Cost
//           </Button>
//           <Button className="bg-[#2563eb] hover:bg-[#1E3A8A] text-white text-lg font-semibold shadow-xl rounded-full" onClick={() => router.push("/payment")}>
//             Payment
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
