// /src/app/api/saved-locations/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const user_id = 1; // dummy user id
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM saved_locations WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching saved locations:", error);
    return NextResponse.json({ error: "Failed to fetch saved locations", details: error.message }, { status: 500 });
  }
}
