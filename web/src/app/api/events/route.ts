import { NextRequest, NextResponse } from "next/server"

// Replace with your DB/service logic
const API_BASE_URL = process.env.API_BASE_URL || "https://plannr.azurewebsites.net/api"

export async function GET(req: NextRequest) {
  // List events
  const res = await fetch(`${API_BASE_URL}/events`, { method: "GET" })
  const data = await res.json()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  // Create event
  const body = await req.json()
  const res = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data)
}
