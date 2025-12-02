import API_ENDPOINTS from "@/utils/api-endpoints"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  // Get JWT from session
  const token = await getToken({ req })
  const jwt = typeof token === "object" && token !== null && "jwt" in token ? (token as { jwt: string }).jwt : undefined
  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let eventData
  try {
    eventData = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid event data" }, { status: 400 })
  }

  // Forward to backend
  const backendRes = await fetch(API_ENDPOINTS.EVENTS.ROOT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(eventData),
  })

  let data
  try {
    const text = await backendRes.text()
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { error: "Invalid response from backend" }
  }
  return NextResponse.json(data, { status: backendRes.status })
}
