import API_ENDPOINTS from "@/utils/api-endpoints"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // Get JWT from session
    const token = await getToken({ req })
    const jwt =
      typeof token === "object" && token !== null && "jwt" in token ? (token as { jwt: string }).jwt : undefined
    if (!jwt) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    // Forward request to backend with JWT
    const res = await fetch(API_ENDPOINTS.EVENTS.ROOT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch events" }, { status: res.status })
    }
    const events = await res.json()
    return NextResponse.json(events)
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
