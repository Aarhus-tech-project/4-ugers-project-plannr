import API_ENDPOINTS from "@/utils/api-endpoints"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  let body: Record<string, unknown> = {}
  const contentType = req.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    try {
      body = await req.json()
    } catch {
      console.error("Invalid JSON body")
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }
  }
  if (!body.email || !body.password) {
    console.error("Missing email or password")
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
  }
  const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
    }),
  })
  let data
  const backendContentType = res.headers.get("content-type") || ""
  if (backendContentType.includes("application/json")) {
    data = await res.json()
  } else {
    data = { error: await res.text() }
  }
  console.log("Login response data:", res)
  if (!res.ok) {
    console.error("Backend login failed:", data)
  }
  return NextResponse.json(data, { status: res.status })
}
