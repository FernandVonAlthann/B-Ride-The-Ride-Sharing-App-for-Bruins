// app/api/ride-history/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const client = await pool.connect();
    const query = `
      SELECT 
        r.pickup_location AS "from", 
        r.dropoff_location AS "to", 
        rh.timestamp AS time
      FROM ride_history rh
      JOIN rides r ON rh.ride_id = r.id
      ORDER BY rh.timestamp DESC
    `;
    const result = await client.query(query);
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching ride history: ", error);
    return NextResponse.json(
      { error: "Failed to fetch ride history" },
      { status: 500 }
    );
  }
}
