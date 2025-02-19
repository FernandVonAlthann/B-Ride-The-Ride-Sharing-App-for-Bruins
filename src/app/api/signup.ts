// pages/api/signup.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Dummy database and user handling functions
let users = []; // This will be replaced with your actual database logic

const SECRET = "our_secret_key";  // This can be your secret key

// Simulate getting a user by email (this should interact with your database)
async function getUserByEmail(email: string) {
  return users.find(user => user.email === email);
}

// Simulate creating a user (this should interact with your database)
async function createUser({ name, email, password }: { name: string, email: string, password: string }) {
  const newUser = { name, email, password };
  users.push(newUser); // You will store this in the database
  return newUser;
}

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  // Check if the email already exists in the database
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  }

  // Hash the password before saving it
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Save the new user in the database
  const newUser = await createUser({ name, email, password: hashedPassword });

  if (newUser) {
    // Generate a JWT token for the user
    const token = jwt.sign({ userId: email }, SECRET, { expiresIn: '1h' });

    return NextResponse.json({ token, userId: email });
  }

  return NextResponse.json({ error: "Error creating user" }, { status: 500 });
}
