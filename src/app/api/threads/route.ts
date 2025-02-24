import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM threads ORDER BY id DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, creator_id } = await request.json(); // Expect creator_id from request

    const result = await pool.query(
      "INSERT INTO threads (title, content, creator_id, likes) VALUES ($1, $2, $3, 0) RETURNING *",
      [title, content, creator_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 });
  }
}
