import API_ENDPOINTS from "@utils/api-endpoints"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const id = context.params.id
  console.log("[API] GET /api/profiles/", id, "called")
  const jwt = req.headers.get("authorization")?.replace("Bearer ", "")
  console.log("JWT:", jwt)
  if (!jwt) {
    console.log("Missing JWT token")
    return new Response(JSON.stringify({ error: "Missing JWT token" }), { status: 401 })
  }
  const url = API_ENDPOINTS.PROFILES.BY_ID(id)
  console.log("Proxying to backend URL:", url)
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
  console.log("Backend response status:", res.status)
  let data
  try {
    data = await res.json()
    console.log("Backend response data:", data)
  } catch (err) {
    console.log("Error parsing backend response:", err)
    data = { error: "Failed to parse backend response" }
  }
  return new Response(JSON.stringify(data), { status: res.status })
}
