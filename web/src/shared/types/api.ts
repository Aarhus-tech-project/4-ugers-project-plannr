// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  error: string
  status: number
  details?: unknown
}

// Backend API Endpoints
export interface BackendEndpoints {
  auth: {
    login: string
    register: string
    logout: string
    profile: string
  }
  events: {
    root: string
    byId: (id: string) => string
    attend: (id: string) => string
  }
  profiles: {
    root: string
    byId: (id: string) => string
  }
}

// Request/Response DTOs
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  profileId: string
  email?: string
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
  phone?: string
  avatarUrl?: string
}

export interface CreateEventRequest {
  title: string
  description?: string
  startAt: string
  endAt?: string
  location?: unknown
  images?: unknown[]
}
