// /src/app/api/reviews/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET: Fetch all reviews
export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM reviews ORDER BY created_at DESC");
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST: Create a new review
export async function POST(request: Request) {
  try {
    const { ride_id, reviewer_id, reviewee_id, rating, review } = await request.json();

    const client = await pool.connect();
    const queryText = `
      INSERT INTO reviews (ride_id, reviewer_id, reviewee_id, rating, review)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [ride_id, reviewer_id, reviewee_id, rating, review];

    const result = await client.query(queryText, values);
    client.release();

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
