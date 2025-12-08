import type { ApiError, ApiResponse } from "@/lib/types/api"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

/**
 * Extract JWT token from Next.js request
 * Checks both next-auth session and Authorization header
 */
export async function getJwtFromRequest(req: NextRequest): Promise<string | null> {
  // First try to get from next-auth session
  const token = await getToken({ req })

  if (token && typeof token.jwt === "string") {
    return token.jwt
  }

  // Fallback to Authorization header (for client-side API calls)
  const authHeader = req.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const jwt = authHeader.substring(7)
    return jwt
  }

  return null
}

/**
 * Create standardized error response
 */
export function createErrorResponse(message: string, status: number = 500, details?: unknown): Response {
  const error: ApiError = {
    error: message,
    status,
    details,
  }

  return Response.json(error, { status })
}

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(data: T, status: number = 200): Response {
  const response: ApiResponse<T> = { data }
  return Response.json(response, { status })
}

/**
 * Parse request body safely
 */
export async function parseRequestBody<T = unknown>(req: NextRequest): Promise<T | null> {
  try {
    return await req.json()
  } catch {
    return null
  }
}

/**
 * Forward request to backend with JWT
 */
export async function forwardToBackend(url: string, options: RequestInit & { jwt?: string }): Promise<Response> {
  const { jwt, ...fetchOptions } = options

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`
  }

  return fetch(url, {
    ...fetchOptions,
    headers: {
      ...headers,
      ...(fetchOptions.headers as Record<string, string>),
    },
  })
}

/**
 * Handle backend response
 */
export async function handleBackendResponse(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    const text = await res.text()
    return text ? JSON.parse(text) : {}
  }

  return { error: await res.text() }
}
