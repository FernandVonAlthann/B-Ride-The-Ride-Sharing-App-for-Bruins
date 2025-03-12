// /src/app/api/saved-locations/[id]/route.ts
import { NextResponse } from "next/server";
import pool, { getClient } from "@/lib/db";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  let client;
  try {
    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: "Invalid ID provided" }, { status: 400 });
    }
    
    client = await getClient();
    console.log(`Connected to database for DELETE saved location with ID: ${id}`);
    
    const result = await client.query("DELETE FROM saved_locations WHERE id = $1 RETURNING *", [id]);
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Saved location not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Saved location deleted successfully",
      deletedLocation: result.rows[0]
    });
  } catch (error) {
    console.error("Error deleting saved location:", error);
    return NextResponse.json({ 
      error: "Failed to delete saved location",
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
