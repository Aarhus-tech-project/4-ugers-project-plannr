import { NextResponse } from 'next/server';

// POST /api/auth/login
export async function POST(request: Request) {
  const { email, password } = await request.json();
  // TODO: Replace with real DB call to validate user and return token
  // Example: const res = await fetch('http://localhost:5000/api/profiles/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  // const { profileId, token } = await res.json();
  // if (!profileId || !token) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  // return NextResponse.json({ profileId, token });

  // Placeholder response for now
  if (email === 'test@example.com' && password === 'password123') {
    return NextResponse.json({ profileId: '1', token: 'mock-token' });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
