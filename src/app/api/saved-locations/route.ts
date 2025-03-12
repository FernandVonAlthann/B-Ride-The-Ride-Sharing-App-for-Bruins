// /src/app/api/saved-locations/route.ts
import { NextResponse } from "next/server";
import pool, { getClient } from "@/lib/db";

export async function GET() {
  let client;
  try {
    const user_id = 1;
    client = await getClient();
    console.log("Connected to database for GET saved locations");
    
    const result = await client.query(
      "SELECT * FROM saved_locations WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching saved locations:", error);
    return NextResponse.json({ 
      error: "Failed to fetch saved locations", 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

export async function POST(request: Request) {
  let client;
  try {
    const { user_id, location_name } = await request.json();
    
    if (!user_id || !location_name) {
      return NextResponse.json({ 
        error: "Missing required fields: user_id and location_name are required" 
      }, { status: 400 });
    }
    
    client = await getClient();
    console.log("Connected to database for POST saved location");
    
    const queryText = `
      INSERT INTO saved_locations (user_id, location_name)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [user_id, location_name];
    
    const result = await client.query(queryText, values);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating saved location:", error);
    return NextResponse.json({ 
      error: "Failed to create saved location",
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
