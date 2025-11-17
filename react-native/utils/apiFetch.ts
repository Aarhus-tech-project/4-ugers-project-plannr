import { getAuthToken } from "@/utils/authToken"

/**
 * Custom error for API requests
 */
export class ApiError extends Error {
  status?: number
  data?: any
  constructor(message: string, status?: number, data?: any) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

export interface ApiFetchOptions extends RequestInit {
  timeout?: number // ms
  signal?: AbortSignal
  skipAuth?: boolean // If true, do not require token
}

/**
 * Makes an authenticated API request with robust error handling, JSON parsing, and timeout support.
 * Throws ApiError on failure.
 *
 * @param {string} url - The endpoint URL
 * @param {ApiFetchOptions} [options] - Fetch options (method, headers, body, timeout, signal)
 * @returns {Promise<Response>} - Resolves with the fetch Response object
 * @throws {ApiError} - On network, HTTP, or parsing errors
 * @example
 * try {
 *   const res = await apiFetch("/api/events", { method: "GET" })
 *   const data = await res.json()
 * } catch (err) {
 *   if (err instanceof ApiError) {
 *     // handle error
 *   }
 * }
 */
export async function apiFetch(url: string, options: ApiFetchOptions = {}): Promise<Response> {
  let token = ""
  // Check for Authorization header first
  const hasAuthHeader = options.headers && typeof options.headers === "object" && "Authorization" in options.headers
  if (!options.skipAuth && !hasAuthHeader) {
    token = await getAuthToken()
    if (!token) {
      throw new ApiError("No authentication token available. API request aborted.")
    }
  }

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    ...(hasAuthHeader ? {} : token ? { Authorization: `Bearer ${token}` } : {}),
  }

  // Timeout/cancellation support
  const controller = options.signal ? undefined : new AbortController()
  const signal = options.signal || controller?.signal
  const timeout = options.timeout ?? 15000 // default 15s
  let timeoutId: NodeJS.Timeout | undefined

  // Start timeout
  if (controller) {
    timeoutId = setTimeout(() => controller.abort(), timeout)
  }

  let response: Response
  try {
    response = await fetch(url, { ...options, headers, signal })
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new ApiError("Request timed out or aborted.")
    }
    throw new ApiError("Network error: " + err.message)
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
  // HTTP error handling
  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
    } catch {
      errorData = await response.text()
    }
    throw new ApiError(`API error: ${response.status} ${response.statusText}`, response.status, errorData)
  }

  return response
}
