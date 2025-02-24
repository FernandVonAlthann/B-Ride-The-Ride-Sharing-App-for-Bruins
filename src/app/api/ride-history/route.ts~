// app/api/rides/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fromFilter = searchParams.get('from') || '';
  const toFilter = searchParams.get('to') || '';

  try {
    const client = await pool.connect();
    const queryText = `
      SELECT id, pickup_location, dropoff_location, created_at
      FROM rides
      WHERE LOWER(pickup_location) LIKE $1 AND LOWER(dropoff_location) LIKE $2
      ORDER BY created_at DESC
    `;
    const values = [`%${fromFilter.toLowerCase()}%`, `%${toFilter.toLowerCase()}%`];
    const result = await client.query(queryText, values);
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rides' }, { status: 500 });
  }
}
