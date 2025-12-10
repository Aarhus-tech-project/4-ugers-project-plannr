/**
 * API response types
 */

export interface ApiError {
  error: string
  status: number
  details?: unknown
}

export interface ApiResponse<T> {
  data: T
}
