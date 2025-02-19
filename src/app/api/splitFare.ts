import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { rideId, users, totalFare } = await req.json();

  if (!rideId || !users || users.length === 0 || !totalFare) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const splitAmount = totalFare / users.length;

  return NextResponse.json({ rideId, users, splitAmount });
}
