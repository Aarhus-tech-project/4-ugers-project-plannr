import { BACKEND_API } from "@/lib/api/config"
import {
  createErrorResponse,
  forwardToBackend,
  getJwtFromRequest,
  handleBackendResponse,
} from "@/lib/utils/api-helpers"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const jwt = await getJwtFromRequest(req)
  if (!jwt) {
    return createErrorResponse("Unauthorized", 401)
  }

  const res = await forwardToBackend(BACKEND_API.events.byId(id), {
    method: "GET",
    jwt,
  })

  const data = await handleBackendResponse(res)
  return Response.json(data, { status: res.status })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const jwt = await getJwtFromRequest(req)
  if (!jwt) {
    return createErrorResponse("Unauthorized", 401)
  }

  const body = await req.json()

  const res = await forwardToBackend(BACKEND_API.events.byId(id), {
    method: "PUT",
    jwt,
    body: JSON.stringify(body),
  })

  const data = await handleBackendResponse(res)
  return Response.json(data, { status: res.status })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const jwt = await getJwtFromRequest(req)
  if (!jwt) {
    return createErrorResponse("Unauthorized", 401)
  }

  const res = await forwardToBackend(BACKEND_API.events.byId(id), {
    method: "DELETE",
    jwt,
  })

  const data = await handleBackendResponse(res)
  return Response.json(data, { status: res.status })
}
