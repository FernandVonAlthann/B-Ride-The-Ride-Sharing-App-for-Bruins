// /src/app/api/saved-locations/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const client = await pool.connect();
    const result = await client.query("DELETE FROM saved_locations WHERE id = $1 RETURNING *", [id]);
    client.release();
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Saved location not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Saved location deleted" });
  } catch (error) {
    console.error("Error deleting saved location:", error);
    return NextResponse.json({ error: "Failed to delete saved location" }, { status: 500 });
  }
}
