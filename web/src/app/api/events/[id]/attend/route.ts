import { BACKEND_API } from "@/lib/api/config"
import {
  createErrorResponse,
  forwardToBackend,
  getJwtFromRequest,
  handleBackendResponse,
} from "@/lib/utils/api-helpers"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const jwt = await getJwtFromRequest(req)
  if (!jwt) {
    return createErrorResponse("Unauthorized", 401)
  }

  const res = await forwardToBackend(BACKEND_API.events.attend(id), {
    method: "POST",
    jwt,
  })

  const data = await handleBackendResponse(res)
  return Response.json(data, { status: res.status })
}
