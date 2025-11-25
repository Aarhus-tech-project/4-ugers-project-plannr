import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_BASE_URL || "https://plannr.azurewebsites.net/api"

export async function GET(req: NextRequest, context: { params: { email: string } }) {
  const { email } = await context.params
  const res = await fetch(`${API_BASE_URL}/profiles/by-email/${email}`, { method: "GET" })
  const data = await res.json()
  return NextResponse.json(data)
}
