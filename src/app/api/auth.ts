import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = "our_secret_key";  // THIS IS OUR KEY

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    const user = await getUserByEmail(email);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });

    return NextResponse.json({ token });
}
