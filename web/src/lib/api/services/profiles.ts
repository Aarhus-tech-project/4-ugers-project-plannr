import { apiClient } from "@/lib/api/client"
import type { Profile } from "@/shared/types"

/**
 * Client-side service for profile-related API calls
 */
export const profilesService = {
  /**
   * Get profile by ID
   */
  async getById(id: string, jwt: string): Promise<Profile> {
    return apiClient.get<Profile>(`/api/profiles/${id}`, jwt)
  },

  /**
   * Update profile information
   */
  async update(id: string, data: Partial<Profile>, jwt: string): Promise<Profile> {
    return apiClient.put<Profile>(`/api/profiles/${id}`, data, jwt)
  },
}
