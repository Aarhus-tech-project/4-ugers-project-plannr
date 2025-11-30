import { NextResponse } from 'next/server';

// GET /api/profiles
export async function GET() {
  // TODO: Replace with real data fetching
  return NextResponse.json({ message: 'List of profiles' });
}

// POST /api/profiles
export async function POST(request: Request) {
  // TODO: Replace with real profile creation logic
  const data = await request.json();
  return NextResponse.json({ message: 'Profile created', data });
}
