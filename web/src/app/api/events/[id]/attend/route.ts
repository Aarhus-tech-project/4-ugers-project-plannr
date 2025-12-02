import { BACKEND_API } from "@/lib/api/config"
import {
  createErrorResponse,
  forwardToBackend,
  getJwtFromRequest,
  handleBackendResponse,
} from "@/lib/utils/api-helpers"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const jwt = await getJwtFromRequest(req)
  if (!jwt) {
    return createErrorResponse("Unauthorized", 401)
  }

  const res = await forwardToBackend(BACKEND_API.events.attend(params.id), {
    method: "POST",
    jwt,
  })

  const data = await handleBackendResponse(res)
  return Response.json(data, { status: res.status })
}
