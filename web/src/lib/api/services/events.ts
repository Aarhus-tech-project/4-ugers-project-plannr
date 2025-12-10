import { apiClient } from "@/lib/api/client"
import type { Event } from "@/shared/types"

/**
 * Transform backend event response to frontend Event type
 * Backend uses startAt/endAt directly, frontend expects dateRange.startAt/endAt
 */
function transformEvent(event: any): Event {
  return {
    ...event,
    dateRange: {
      startAt: event.startAt || event.dateRange?.startAt,
      endAt: event.endAt || event.dateRange?.endAt,
    },
  }
}

/**
 * Client-side service for event-related API calls
 */
export const eventsService = {
  /**
   * Get all events
   * @param jwt - Optional JWT token for authenticated requests
   */
  async getAll(jwt?: string, params?: { ids?: string }): Promise<Event[]> {
    const queryString = params?.ids ? `?ids=${params.ids}` : ""
    const events = await apiClient.get<any[]>(`/api/events${queryString}`, jwt)
    return events.map(transformEvent)
  },

  /**
   * Get single event by ID
   */
  async getById(id: string, jwt: string): Promise<Event> {
    const event = await apiClient.get<any>(`/api/events/${id}`, jwt)
    return transformEvent(event)
  },

  /**
   * Create new event
   */
  async create(data: unknown, jwt: string): Promise<Event> {
    return apiClient.post<Event>("/api/events", data, jwt)
  },

  /**
   * Update existing event
   */
  async update(id: string, data: unknown, jwt: string): Promise<Event> {
    return apiClient.put<Event>(`/api/events/${id}`, data, jwt)
  },

  /**
   * Attend an event
   */
  async attend(id: string, jwt: string): Promise<void> {
    return apiClient.post(`/api/events/${id}/attend`, {}, jwt)
  },

  /**
   * Update event attendance counters
   */
  async updateAttendance(
    id: string,
    data: { interested?: number; going?: number; checkedIn?: number },
    jwt: string
  ): Promise<void> {
    return apiClient.patch(`/api/events/${id}/attendance`, data, jwt)
  },
}
