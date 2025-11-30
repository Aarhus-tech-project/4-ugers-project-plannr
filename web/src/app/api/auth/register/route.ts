import { NextResponse } from "next/server"

// POST /api/auth/register
export async function POST(request: Request) {
  const { name, email, password } = await request.json()
  // Call backend API to create user
  const res = await fetch(`${process.env.API_BASE_URL || "http://localhost:5000/api"}/profiles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) {
    const error = await res.text()
    return NextResponse.json({ error }, { status: res.status })
  }
  const response = await res.json()
  console.log("Registration successful:", response)
  return NextResponse.json(response)
}
