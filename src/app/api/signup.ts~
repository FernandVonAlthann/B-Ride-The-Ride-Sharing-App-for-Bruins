import { NextRequest, NextResponse } from "next/server";

let userLocations: { userId: string; lat: number; lng: number }[] = [];

export async function POST(req: NextRequest) {
  const { userId, lat, lng } = await req.json();

  // Remove old location if it exists
  userLocations = userLocations.filter(user => user.userId !== userId);
  
  // Add the new location
  userLocations.push({ userId, lat, lng });

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ locations: userLocations });
}
