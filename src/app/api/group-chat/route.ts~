// app/api/emergency-contact/route.ts

import { NextResponse } from "next/server";
// Import your database connection; adjust the import based on your project setup.
// For example, using node-postgres or an ORM like Prisma:
// import { db } from "@/lib/db";

const DUMMY_USER_ID = 1; // Replace this with your authenticated user's ID

export async function GET() {
  try {
    // Replace this with your actual database query:
    // const result = await db.query("SELECT phone_number FROM emergency_contacts WHERE user_id = $1", [DUMMY_USER_ID]);
    // const emergencyContact = result.rows[0]?.phone_number || "";
    
    // For demonstration purposes, we'll return a dummy contact:
    const emergencyContact = "123-456-7890";
    
    return NextResponse.json({ emergencyContact });
  } catch (error) {
    console.error("GET emergency-contact error:", error);
    return NextResponse.json(
      { error: "Failed to fetch emergency contact" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { emergencyContact } = await request.json();

    // Replace this with your actual upsert query.
    // For example, using SQL:
    // await db.query(`
    //   INSERT INTO emergency_contacts (user_id, phone_number)
    //   VALUES ($1, $2)
    //   ON CONFLICT (user_id)
    //   DO UPDATE SET phone_number = EXCLUDED.phone_number, updated_at = CURRENT_TIMESTAMP
    // `, [DUMMY_USER_ID, emergencyContact]);

    // For demonstration, we'll assume the update is successful.
    return NextResponse.json({ message: "Emergency contact saved!" }, { status: 200 });
  } catch (error) {
    console.error("POST emergency-contact error:", error);
    return NextResponse.json(
      { error: "Failed to save emergency contact" },
      { status: 500 }
    );
  }
}
