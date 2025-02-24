// app/api/messages/route.ts

import { NextResponse } from "next/server";

// Use an in-memory array to store messages for demo purposes.
let messages: { id: number; message: string }[] = [
  { id: 1, message: "Hello from Alice" },
  { id: 2, message: "Hi from Bob" },
];

export async function GET() {
  try {
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const newMessage = {
      id: Date.now(),
      message,
    };
    messages.push(newMessage);
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
