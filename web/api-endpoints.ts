// Centralized API endpoint URLs for the web frontend
// Update these as needed to match your backend routes

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
  },
  EVENTS: {
    ROOT: `${API_BASE_URL}/api/events`,
    BY_ID: (id: string | number) => `${API_BASE_URL}/api/events/${id}`,
    ATTEND: (id: string | number) => `${API_BASE_URL}/api/events/${id}/attend`,
    IMAGES: (id: string | number) => `${API_BASE_URL}/api/events/${id}/images`,
  },
  PROFILES: {
    ROOT: `${API_BASE_URL}/api/profiles`,
    BY_ID: (id: string | number) => `${API_BASE_URL}/api/profiles/${id}`,
  },
}

export default API_ENDPOINTS
