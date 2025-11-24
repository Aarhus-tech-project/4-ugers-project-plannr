import type { Event } from "@/interfaces/event"
import type { Profile } from "@/interfaces/profile"
import { apiFetch } from "@/utils/apiFetch"

const API_BASE_URL = process.env.API_BASE_URL || "https://plannr.azurewebsites.net/api"

/**
 * Event API methods
 */
export const api = {
  events: {
    /**
     * Fetch all events from the backend.
     * @returns {Promise<Event[]>} Resolves with an array of event objects.
     * @example
     * const events = await api.events.list();
     */
    list: async (): Promise<Event[]> => {
      try {
        const res = await apiFetch(`${API_BASE_URL}/events`, { method: "GET" })
        const data = await res.json()
        return data
      } catch (err) {
        console.error("Error fetching events:", err)
        return []
      }
    },
    /**
     * Fetch a single event by its unique ID.
     * @param {string} eventId - The unique identifier of the event.
     * @returns {Promise<Event>} Resolves with the event object if found.
     * @example
     * const event = await api.events.get('abc123');
     */
    get: async (eventId: string): Promise<Event> => {
      const res = await apiFetch(`${API_BASE_URL}/events/${eventId}`, { method: "GET" })
      return res.json()
    },
    /**
     * Create a new event in the backend.
     * @param {object} data - The event data to create (see Event type for structure).
     * @returns {Promise<Event>} Resolves with the created event object.
     * @example
     * const newEvent = await api.events.create({ title: 'Party', ... });
     */
    create: async (data: any): Promise<Event> => {
      const res = await apiFetch(`${API_BASE_URL}/events`, {
        method: "POST",
        body: JSON.stringify(data),
      })
      return res.json()
    },
    /**
     * Update an existing event by its ID.
     * @param {string} eventId - The unique identifier of the event to update.
     * @param {object} data - The updated event data (see Event type for structure).
     * @returns {Promise<Event>} Resolves with the updated event object.
     * @example
     * const updated = await api.events.update('abc123', { title: 'New Title' });
     */
    update: async (eventId: string, data: any): Promise<Event> => {
      const res = await apiFetch(`${API_BASE_URL}/events/${eventId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
      return res.json()
    },
    /**
     * Delete an event by its ID.
     * @param {string} eventId - The unique identifier of the event to delete.
     * @returns {Promise<boolean>} Resolves true if deletion was successful.
     * @example
     * const success = await api.events.delete('abc123');
     */
    delete: async (eventId: string): Promise<boolean> => {
      const res = await apiFetch(`${API_BASE_URL}/events/${eventId}`, { method: "DELETE" })
      return res.ok
    },
    /**
     * Update attendance counts for an event.
     * @param {string} eventId - The unique identifier of the event.
     * @param {object} attendance - Attendance update object (interested, going, checkedIn).
     * @returns {Promise<object>} Resolves with the updated attendance object.
     * @example
     * await api.events.patchAttendance('abc123', { going: 10 });
     */
    patchAttendance: async (
      eventId: string,
      attendance: { interested?: number; going?: number; checkedIn?: number }
    ): Promise<object> => {
      const res = await apiFetch(`${API_BASE_URL}/events/${eventId}/attendance`, {
        method: "PATCH",
        body: JSON.stringify(attendance),
      })

      return res.json()
    },
    /**
     * Search for events created by a specific profile.
     * @param {string} creatorId - The profile ID of the creator.
     * @returns {Promise<Event[]>} Resolves with an array of events created by the profile.
     * @example
     * const myEvents = await api.events.searchByCreator('profile123');
     */
    searchByCreator: async (creatorId: string): Promise<Event[]> => {
      const res = await apiFetch(`${API_BASE_URL}/events/search?creatorId=${creatorId}`, { method: "GET" })
      return res.json()
    },
  },
  /**
   * Profile API methods
   */
  profiles: {
    /**
     * Patch profile info (email, name, bio, phone)
     * @param {string} profileId - The unique identifier of the profile to update.
     * @param {object} data - The info fields to update.
     * @returns {Promise<Profile>} Resolves with the updated profile object.
     * @example
     * const updated = await api.profiles.patchInfo('profile123', { email: 'new@email.tld', name: 'New Name', ... });
     */
    patchInfo: async (
      profileId: string,
      data: { email: string; name: string; bio: string; phone: string }
    ): Promise<Profile> => {
      const res = await apiFetch(`${API_BASE_URL}/profiles/${profileId}/info`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
      return res.json()
    },
    /**
     * Fetch all user profiles from the backend.
     * @returns {Promise<Profile[]>} Resolves with an array of profile objects.
     * @example
     * const profiles = await api.profiles.list();
     */
    list: async (): Promise<Profile[]> => {
      const res = await apiFetch(`${API_BASE_URL}/profiles`, { method: "GET" })
      return res.json()
    },
    /**
     * Fetch a single user profile by its unique ID.
     * @param {string} profileId - The unique identifier of the profile.
     * @returns {Promise<Profile>} Resolves with the profile object if found.
     * @example
     * const profile = await api.profiles.get('profile123');
     */
    /**
     * Fetch a single profile by ID, optionally with a token for immediate post-login fetch.
     */
    get: async (profileId: string, token?: string): Promise<Profile> => {
      const res = await apiFetch(`${API_BASE_URL}/profiles/${profileId}`, {
        method: "GET",
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      })
      return res.json()
    },
    /**
     * Create a new user profile.
     * @param {object} data - The profile data to create (see Profile type for structure).
     * @returns {Promise<Profile>} Resolves with the created profile object.
     * @example
     * const newProfile = await api.profiles.create({ name: 'Jane', ... });
     */
    create: async (data: any): Promise<Profile> => {
      const res = await apiFetch(`${API_BASE_URL}/profiles`, {
        method: "POST",
        body: JSON.stringify(data),
      })
      return res.json()
    },
    /**
     * Update an existing user profile by its ID.
     * @param {string} profileId - The unique identifier of the profile to update.
     * @param {object} data - The updated profile data (see Profile type for structure).
     * @returns {Promise<Profile>} Resolves with the updated profile object.
     * @example
     * const updated = await api.profiles.update('profile123', { name: 'John' });
     */
    update: async (profileId: string, data: any): Promise<Profile> => {
      const res = await apiFetch(`${API_BASE_URL}/profiles/${profileId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
      return res.json()
    },
    /**
     * Fetch a user profile by email address.
     * @param {string} email - The email address to search for.
     * @returns {Promise<Profile>} Resolves with the profile object if found.
     * @example
     * const profile = await api.profiles.getByEmail('user@email.com');
     */
    getByEmail: async (email: string): Promise<Profile> => {
      const res = await apiFetch(`${API_BASE_URL}/profiles/by-email/${email}`, { method: "GET" })
      return res.json()
    },
  },
  /**
   * Auth API methods
   */
  auth: {
    /**
     * Authenticate a user and start a session.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Promise<SessionType>} Resolves with the session object if login is successful.
     * @example
     * const session = await api.auth.login('user@email.com', 'password123');
     */
    /**
     * Login returns profileId and token, not SessionType
     */
    login: async (email: string, password: string): Promise<{ profileId: string; token: string }> => {
      // Only login uses skipAuth
      const res = await apiFetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        skipAuth: true,
      })
      return res.json()
    },
    /**
     * Register a new user account.
     * @param {object} data - The registration data (see Profile type for structure).
     * @returns {Promise<Profile>} Resolves with the created profile object.
     * @example
     * const profile = await api.auth.register({ email: 'user@email.com', ... });
     */
    register: async (data: any): Promise<Profile> => {
      // Only register uses skipAuth
      const res = await apiFetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify(data),
        skipAuth: true,
      })
      return res.json()
    },
  },
  /**
   * Like an event: add eventId to interestedEvents and patch attendance.
   * @param {string} profileId - The profile to update.
   * @param {string[]} currentInterestedEvents - The current interestedEvents array.
   * @param {string} eventId - The event to like.
   * @returns {Promise<{profile: Profile, attendance: object}>} Updated profile and attendance.
   */
  likeEvent: async (
    profileId: string,
    currentInterestedEvents: string[],
    eventId: string
  ): Promise<{ profile: Profile; attendance: object }> => {
    // Add eventId to interestedEvents if not already present
    const updatedEvents = currentInterestedEvents.includes(eventId)
      ? currentInterestedEvents
      : [...currentInterestedEvents, eventId]
    try {
      // Fetch the full profile first
      const currentProfile = await api.profiles.get(profileId)
      // Merge interestedEvents into the full profile object
      const updatedProfile = { ...currentProfile, interestedEvents: updatedEvents }
      const profileRes = await api.profiles.update(profileId, updatedProfile)
      // Fetch the current event to get the latest interested count
      const event = await api.events.get(eventId)
      const currentInterested = event.attendance?.interested ?? 0
      const attendancePayload = { interested: currentInterested + 1 }
      const attendanceRes = await api.events.patchAttendance(eventId, attendancePayload)
      return { profile: profileRes, attendance: attendanceRes }
    } catch (err) {
      if (err && typeof err === "object" && "data" in err) {
        console.error("likeEvent error", err, "Backend error data:", err.data)
      } else {
        console.error("likeEvent error", err)
      }
      throw err
    }
  },
}
