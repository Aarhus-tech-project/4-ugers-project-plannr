import type { BackendEndpoints } from "@/shared/types/api"

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL environment variable is not set")
}

export const BACKEND_API: BackendEndpoints = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    profile: `${API_BASE_URL}/api/auth/profile`,
  },
  events: {
    root: `${API_BASE_URL}/api/events`,
    byId: (id: string) => `${API_BASE_URL}/api/events/${id}`,
    attend: (id: string) => `${API_BASE_URL}/api/events/${id}/attend`,
  },
  profiles: {
    root: `${API_BASE_URL}/api/profiles`,
    byId: (id: string) => `${API_BASE_URL}/api/profiles/${id}`,
  },
}

export { API_BASE_URL }
