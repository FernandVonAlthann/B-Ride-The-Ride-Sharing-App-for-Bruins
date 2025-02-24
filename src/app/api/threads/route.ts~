// src/app/api/threads/route.ts
import { NextResponse } from 'next/server';

// Dummy data example
const threads = [
  {
    id: 1,
    title: 'Sample Thread',
    content: 'This is a sample thread.',
    replies: [],
    likes: 0,
  },
];

export async function GET() {
  // You can replace this with your actual database call
  return NextResponse.json(threads);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Insert logic to save the thread to your database.
    // For demonstration, we simply echo back the new thread.
    const newThread = {
      id: Date.now(),
      title: body.title,
      content: body.content,
      replies: [],
      likes: 0,
    };
    // Optionally: Save newThread to the database here.
    return NextResponse.json(newThread, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
  }
}
