import { BACKEND_API } from "@/lib/api/config"
import {
  createErrorResponse,
  forwardToBackend,
  getJwtFromRequest,
  handleBackendResponse,
  parseRequestBody,
} from "@/lib/utils/api-helpers"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const jwt = await getJwtFromRequest(req)

  const url = new URL(req.url)
  const ids = url.searchParams.get("ids")

  // Use /search endpoint for public access (allows anonymous)
  // Use regular endpoint with JWT if filtering by ids
  const backendUrl = ids ? `${BACKEND_API.events.root}?ids=${ids}` : `${BACKEND_API.events.root}/search?take=100`

  const res = await forwardToBackend(backendUrl, { method: "GET", jwt: jwt || undefined })

  if (!res.ok) {
    const errorText = await res.text()
    console.error("Backend error response:", res.status, errorText)
    return createErrorResponse(`Backend error: ${res.status} - ${errorText}`, res.status)
  }

  const data = await handleBackendResponse(res)
  return Response.json(data, { status: res.status })
}

export async function POST(req: NextRequest) {
  const jwt = await getJwtFromRequest(req)
  if (!jwt) {
    return createErrorResponse("Unauthorized", 401)
  }

  const body = await parseRequestBody(req)
  if (!body) {
    return createErrorResponse("Invalid request body", 400)
  }

  const res = await forwardToBackend(BACKEND_API.events.root, {
    method: "POST",
    jwt,
    body: JSON.stringify(body),
  })

  const data = await handleBackendResponse(res)
  return Response.json(data, { status: res.status })
}
