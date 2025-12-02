import { apiClient } from "@/lib/api/client"
import type { Event } from "@/lib/types"

/**
 * Client-side service for event-related API calls
 */
export const eventsService = {
  /**
   * Get all events
   */
  async getAll(jwt: string, params?: { ids?: string }): Promise<Event[]> {
    const queryString = params?.ids ? `?ids=${params.ids}` : ""
    return apiClient.get<Event[]>(`/api/events${queryString}`, jwt)
  },

  /**
   * Get single event by ID
   */
  async getById(id: string, jwt: string): Promise<Event> {
    return apiClient.get<Event>(`/api/events/${id}`, jwt)
  },

  /**
   * Create new event
   */
  async create(data: unknown, jwt: string): Promise<Event> {
    return apiClient.post<Event>("/api/events", data, jwt)
  },

  /**
   * Attend an event
   */
  async attend(id: string, jwt: string): Promise<void> {
    return apiClient.post(`/api/events/${id}/attend`, {}, jwt)
  },
}
