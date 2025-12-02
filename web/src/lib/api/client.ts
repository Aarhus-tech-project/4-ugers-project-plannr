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

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: "An error occurred",
      }))
      throw new Error(error.error || "Request failed")
    }

    return response.json()
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
