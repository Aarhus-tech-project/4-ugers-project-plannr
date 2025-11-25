import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_BASE_URL || "https://plannr.azurewebsites.net/api"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const creatorId = searchParams.get("creatorId")
  const res = await fetch(`${API_BASE_URL}/events/search?creatorId=${creatorId}`, { method: "GET" })
  const data = await res.json()
  return NextResponse.json(data)
}
