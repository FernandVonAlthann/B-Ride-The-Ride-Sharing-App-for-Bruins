// app/api/group-chat/route.ts

import { NextResponse } from "next/server";

// Initialize a global messages array with dummy messages.
let messages = [
  {
    id: 1,
    sender: "Alice",
    content: "Hello, everyone!",
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    sender: "Bob",
    content: "Hi Alice!",
    timestamp: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    // Return the current list of messages
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching group chat messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch group chat messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { sender, content } = await request.json();

    // Create a new message object
    const newMessage = {
      id: Date.now(),
      sender,
      content,
      timestamp: new Date().toISOString(),
    };

    // Add the new message to the global array
    messages.push(newMessage);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending group chat message:", error);
    return NextResponse.json(
      { error: "Failed to send group chat message" },
      { status: 500 }
    );
  }
}
