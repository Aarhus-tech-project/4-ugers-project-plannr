import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_BASE_URL || "https://plannr.azurewebsites.net/api"

export async function GET(req: NextRequest, { params }: { params: { profileId: string } }) {
  const { profileId } = params
  const res = await fetch(`${API_BASE_URL}/profiles/${profileId}`, { method: "GET" })
  const data = await res.json()
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest, { params }: { params: { profileId: string } }) {
  const { profileId } = params
  const body = await req.json()
  const res = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data)
}
