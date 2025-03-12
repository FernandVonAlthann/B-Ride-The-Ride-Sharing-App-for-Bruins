// /src/app/api/reviews/route.ts
import { NextResponse } from "next/server";
import pool, { getClient } from "@/lib/db";

// GET: Fetch all reviews
export async function GET() {
  let client;
  try {
    client = await getClient();
    console.log("Connected to database for GET reviews");
    
    const result = await client.query("SELECT * FROM reviews ORDER BY created_at DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ 
      error: "Failed to fetch reviews",
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

// POST: Create a new review
export async function POST(request: Request) {
  let client;
  try {
    const { ride_id, reviewer_id, reviewee_id, rating, review } = await request.json();
    
    if (!ride_id || !reviewer_id || !reviewee_id || !rating) {
      return NextResponse.json({ 
        error: "Missing required fields: ride_id, reviewer_id, reviewee_id, and rating are required" 
      }, { status: 400 });
    }
    
    client = await getClient();
    console.log("Connected to database for POST review");
    
    const queryText = `
      INSERT INTO reviews (ride_id, reviewer_id, reviewee_id, rating, review)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [ride_id, reviewer_id, reviewee_id, rating, review];

    const result = await client.query(queryText, values);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ 
      error: "Failed to create review",
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
