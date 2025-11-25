import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_BASE_URL || "https://plannr.azurewebsites.net/api"

export async function PATCH(req: NextRequest, { params }: { params: { eventId: string } }) {
  const { eventId } = params
  const body = await req.json()
  const res = await fetch(`${API_BASE_URL}/events/${eventId}/attendance`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data)
}
