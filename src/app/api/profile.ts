import { NextRequest, NextResponse } from "next/server";

let userProfiles: Record<string, { name: string; bio: string; profilePic: string; ridePreferences: string[] }> = {};

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId || !userProfiles[userId]) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(userProfiles[userId]);
}

export async function POST(req: NextRequest) {
  const { userId, name, bio, profilePic, ridePreferences } = await req.json();
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  userProfiles[userId] = { name, bio, profilePic, ridePreferences };
  return NextResponse.json({ success: true });
}
