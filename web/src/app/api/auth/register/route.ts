import { BACKEND_API } from "@/lib/api/config"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Transform frontend lowercase property names to backend PascalCase
    const backendBody = {
      Email: body.email,
      Password: body.password,
      Name: body.name,
      AvatarUrl: body.avatarUrl,
      Phone: body.phone,
    }

    const res = await fetch(BACKEND_API.auth.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendBody),
    })

    const data = await res.json()

    if (!res.ok) {
      return Response.json({ error: data.title || data.message || "Registration failed" }, { status: res.status })
    }

    return Response.json(data, { status: 200 })
  } catch (error) {
    console.error("Registration error:", error)
    return Response.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}
