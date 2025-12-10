/**
 * Client-side API client for making requests to our Next.js API routes
 * This should be used in Client Components and hooks
 */

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }))
        const errorMessage = errorData.error || errorData.message || `Request failed with status ${response.status}`
        console.error(`API Error [${options.method || "GET"} ${endpoint}]:`, errorMessage, errorData)
        throw new Error(errorMessage)
      }

      return response.json()
    } catch (error) {
      if (error instanceof Error) {
        console.error(`API Request Error [${options.method || "GET"} ${endpoint}]:`, error.message)
        throw error
      }
      console.error(`Unknown API Error [${options.method || "GET"} ${endpoint}]:`, error)
      throw new Error("An unexpected error occurred")
    }
  }

  async get<T>(endpoint: string, jwt?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
    })
  }

  async post<T>(endpoint: string, data?: unknown, jwt?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data: unknown, jwt?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: unknown, jwt?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, jwt?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
    })
  }
}

export const apiClient = new ApiClient()
