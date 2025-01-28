import { NextResponse } from 'next/server';
import User from '@/models/user'; // Adjust the path to your User model
import dbConnect from '@/utlis/mongodb'; // Adjust the path to your database connection utility
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY; // Load secret key from environment variables
export async function POST(request) {
  await dbConnect();

  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  }

  const user = await User.findOne({ username });

  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '6m' });

  return NextResponse.json({ message: 'Authentication successful', token });
}