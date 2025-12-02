import { BACKEND_API } from "@/lib/api/config"
import {
  createErrorResponse,
  forwardToBackend,
  getJwtFromRequest,
  handleBackendResponse,
  parseRequestBody,
} from "@/lib/utils/api-helpers"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const jwt = await getJwtFromRequest(req)
  if (!jwt) {
    return createErrorResponse("Unauthorized", 401)
  }

  const url = new URL(req.url)
  const ids = url.searchParams.get("ids")
  const backendUrl = ids ? `${BACKEND_API.events.root}?ids=${ids}` : BACKEND_API.events.root

  const res = await forwardToBackend(backendUrl, { method: "GET", jwt })

  if (!res.ok) {
    return createErrorResponse("Failed to fetch events", res.status)
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
