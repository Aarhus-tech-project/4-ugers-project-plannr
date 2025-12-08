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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const jwt = await getJwtFromRequest(req)

  if (!jwt) {
    console.error("[Attendance] No JWT found")
    return createErrorResponse("Unauthorized", 401)
  }

  const body = await parseRequestBody(req)
  if (!body) {
    return createErrorResponse("Invalid request body", 400)
  }

  console.log("[Attendance] Forwarding to backend with JWT:", jwt.substring(0, 20) + "...")

  const res = await forwardToBackend(`${BACKEND_API.events.root}/${id}/attendance`, {
    method: "PATCH",
    jwt,
    body: JSON.stringify(body),
  })

  console.log("[Attendance] Backend response:", res.status)

  if (!res.ok) {
    const errorText = await res.text()
    console.error("[Attendance] Backend error:", res.status, errorText)
  }

  const data = await handleBackendResponse(res)
  return Response.json(data, { status: res.status })
}
