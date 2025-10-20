import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthPage = req.nextUrl.pathname.startsWith("/login")
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login"],
}
