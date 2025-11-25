import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_BASE_URL || "https://plannr.azurewebsites.net/api"

type PinSession = { pin: string; expiresAt: number }
declare global {
  // eslint-disable-next-line no-var
  var __pinSessionStore: Map<string, PinSession> | undefined
}
const pinSessionStore: Map<string, PinSession> = globalThis.__pinSessionStore || new Map()
globalThis.__pinSessionStore = pinSessionStore

export async function POST(req: NextRequest) {
  const body = await req.json()
  // If pin is present, validate it using session memory
  if (body.pin && body.email) {
    const session = pinSessionStore.get(body.email)
    if (!session || session.pin !== body.pin || session.expiresAt < Date.now()) {
      return NextResponse.json({ error: "Invalid or expired PIN" }, { status: 400 })
    }
    // PIN is valid, remove from session store for security
    pinSessionStore.delete(body.email)
    // Proxy login to backend with email and password only
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
    })
    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status })
    }
    return NextResponse.json(data)
  }
  // If no pin, proceed with normal backend login
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data)
}
