// app/api/language/route.ts

import { NextResponse } from "next/server";

// For demonstration, we use a global variable to simulate the stored language.
// In production, replace this with a database query (e.g., SELECT/UPDATE on the profiles table).
let languagePreference = "en";

export async function GET() {
  try {
    // Simulate a database fetch (e.g., SELECT language FROM profiles WHERE user_id = ?)
    return NextResponse.json({ language: languagePreference });
  } catch (error) {
    console.error("Error fetching language:", error);
    return NextResponse.json({ error: "Failed to fetch language preference" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { language } = await request.json();
    // Simulate a database update (e.g., UPDATE profiles SET language = ? WHERE user_id = ?)
    languagePreference = language;
    return NextResponse.json({ message: "Language preference updated", language });
  } catch (error) {
    console.error("Error updating language:", error);
    return NextResponse.json({ error: "Failed to update language preference" }, { status: 500 });
  }
}
