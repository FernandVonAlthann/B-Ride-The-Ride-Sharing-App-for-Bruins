// app/api/profile/route.ts
import { NextResponse } from "next/server";

// For demo purposes, we’re using an in-memory object.
// Replace this with your database logic.
let userProfile = {
  name: "John Doe",
  email: "johndoe@example.com",
  bio: "I love road trips and carpooling!",
  profilePic: "/default-avatar.png",
  preferences: {
    language: "English",
    ridePreference: "Comfort",
  },
};

export async function GET() {
  try {
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const updatedProfile = await request.json();
    // Merge the updated profile data.
    userProfile = { ...userProfile, ...updatedProfile };
    // In a real app, perform database update operations here.
    return NextResponse.json(userProfile, { status: 201 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
