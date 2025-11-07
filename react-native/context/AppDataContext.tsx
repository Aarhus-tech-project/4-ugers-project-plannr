// Like an event: add to interestedEvents and increment interested count
// Dislike an event: add to notInterestedEvents
// (Moved below state declarations)
import { Event } from "@/interfaces/event"
import { Profile } from "@/interfaces/profile"
import { SessionType } from "@/interfaces/session"
import * as SecureStore from "expo-secure-store"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

interface AppDataContextType {
  events: Event[]
  profiles: Profile[]
  session: SessionType | null
  loading: boolean
  error: string | null
  fetchEvents: () => Promise<void>
  fetchProfiles: () => Promise<void>
  createEvent: (fields: Partial<Event>) => Promise<Event | null>
  updateEvent: (id: string, fields: Partial<Event>) => Promise<void>
  deleteEvent: (id: string) => Promise<boolean>
  updateProfile: (id: string, fields: Partial<Profile>) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  likeEvent: (eventId: string, profileId: string) => Promise<void>
  dislikeEvent: (eventId: string, profileId: string) => Promise<void>
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined)

export const useAppData = () => {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider")
  return ctx
}

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [session, setSession] = useState<SessionType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const SESSION_KEY = "user_session"

  // Session management
  useEffect(() => {
    setLoading(true)
    SecureStore.getItemAsync(SESSION_KEY)
      .then((stored) => {
        if (stored) setSession(JSON.parse(stored))
        else setSession(null)
      })
      .catch(() => setSession(null))
      .finally(() => setLoading(false))
  }, [])

  // Add callback to login and signup to notify when session is ready
  const login = useCallback(
    async (email: string, password: string, onSessionReady?: (session: SessionType) => void) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("https://plannr.azurewebsites.net/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        if (!res.ok) throw new Error("Login failed")
        const data = await res.json()
        const profileRes = await fetch(`https://plannr.azurewebsites.net/api/profiles/by-email/${email}`, {
          headers: { Authorization: `Bearer ${data.token}` },
        })
        if (!profileRes.ok) throw new Error("Failed to fetch profile")
        const profile = await profileRes.json()
        const sessionWithProfile = { ...data, profile }
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(sessionWithProfile))
        setSession(sessionWithProfile)
        if (onSessionReady) onSessionReady(sessionWithProfile)
      } catch (err: any) {
        setError(err.message || "Login error")
        setSession(null)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const signup = useCallback(
    async (name: string, email: string, password: string, onSessionReady?: (session: SessionType) => void) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("https://plannr.azurewebsites.net/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        })
        if (!res.ok) throw new Error("Signup failed")
        const data = await res.json()
        const profileRes = await fetch(`https://plannr.azurewebsites.net/api/profiles/by-email/${email}`, {
          headers: { Authorization: `Bearer ${data.token}` },
        })
        if (!profileRes.ok) throw new Error("Failed to fetch profile")
        const profile = await profileRes.json()
        const sessionWithProfile = { ...data, profile }
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(sessionWithProfile))
        setSession(sessionWithProfile)
        if (onSessionReady) onSessionReady(sessionWithProfile)
      } catch (err: any) {
        setError(err.message || "Signup error")
        setSession(null)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    await SecureStore.deleteItemAsync(SESSION_KEY)
    setSession(null)
    setLoading(false)
  }, [])

  // Events and profiles logic
  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("https://plannr.azurewebsites.net/api/events")
      if (!response.ok) throw new Error("Failed to fetch events")
      const data = await response.json()
      setEvents(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("https://plannr.azurewebsites.net/api/profiles")
      if (!response.ok) throw new Error("Failed to fetch profiles")
      const data = await response.json()
      setProfiles(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createEvent = useCallback(
    async (fields: Partial<Event>) => {
      setLoading(true)
      setError(null)
      // Ensure dateRange property is present for filtering compatibility
      let dateRange = fields.dateRange
      // Fallback: if dateRange is missing, use startAt/endAt from fields
      if (!dateRange) {
        const f: any = fields
        const startAt = f.startAt
        const endAt = f.endAt
        if (startAt && endAt) {
          dateRange = { startAt, endAt }
        }
      }
      const eventFields = { ...fields, dateRange } as Partial<Event>
      // Optimistic: create a temporary event with a local ID
      const tempId = "temp-" + Math.random().toString(36).slice(2)
      const optimisticEvent = { ...eventFields, id: tempId } as Event
      setEvents((prev) => [...prev, optimisticEvent])
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        if (session && session.token) {
          headers["Authorization"] = `Bearer ${session.token}`
        }
        const response = await fetch("https://plannr.azurewebsites.net/api/events", {
          method: "POST",
          headers,
          body: JSON.stringify(eventFields),
        })
        const responseText = await response.text()
        if (!response.ok) throw new Error("Failed to create event: " + responseText)
        let newEvent: Event
        try {
          newEvent = JSON.parse(responseText)
        } catch {
          newEvent = eventFields as Event
        }
        setEvents((prev) => prev.map((ev) => (ev.id === tempId ? newEvent : ev)))
        await fetchEvents()
        return newEvent
      } catch (err: any) {
        setEvents((prev) => prev.filter((ev) => ev.id !== tempId))
        setError(err.message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [fetchEvents, session]
  )

  const updateEvent = useCallback(
    async (id: string, fields: Partial<Event>) => {
      setLoading(true)
      setError(null)
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        if (session && session.token) {
          headers["Authorization"] = `Bearer ${session.token}`
        }
        // Find the current event and merge changes
        const currentEvent = events.find((e) => e.id === id)
        if (!currentEvent) throw new Error("Event not found for update")
        const fullEvent = { ...currentEvent, ...fields }
        const response = await fetch(`https://plannr.azurewebsites.net/api/events/${id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(fullEvent),
        })
        const responseText = await response.text()
        if (!response.ok) throw new Error("Failed to update event: " + responseText)
        await fetchEvents()
      } catch (err: any) {
        console.log("updateEvent error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [fetchEvents, session, events]
  )

  const updateProfile = useCallback(
    async (id: string, fields: Partial<Profile>) => {
      setLoading(true)
      setError(null)
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        if (session && session.token) {
          headers["Authorization"] = `Bearer ${session.token}`
        }
        // Find the current profile and merge changes
        const currentProfile = profiles.find((p) => p.id === id)
        if (!currentProfile) throw new Error("Profile not found for update")
        const fullProfile = { ...currentProfile, ...fields }
        const response = await fetch(`https://plannr.azurewebsites.net/api/profiles/${id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(fullProfile),
        })
        const responseText = await response.text()
        if (!response.ok) throw new Error("Failed to update profile: " + responseText)
        await fetchProfiles()
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [fetchProfiles, session, profiles]
  )

  const deleteEvent = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true)
      setError(null)
      // Optimistic: remove event and update profiles instantly
      const prevEvents = events
      const prevProfiles = profiles
      setEvents((prev) => prev.filter((event) => event.id !== id))
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) => ({
          ...profile,
          interestedEvents: Array.isArray(profile.interestedEvents)
            ? profile.interestedEvents.filter((eid) => eid !== id)
            : profile.interestedEvents,
          goingToEvents: Array.isArray(profile.goingToEvents)
            ? profile.goingToEvents.filter((eid) => eid !== id)
            : profile.goingToEvents,
          checkedInEvents: Array.isArray(profile.checkedInEvents)
            ? profile.checkedInEvents.filter((eid) => eid !== id)
            : profile.checkedInEvents,
        }))
      )
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        if (session && session.token) {
          headers["Authorization"] = `Bearer ${session.token}`
        }
        const response = await fetch(`https://plannr.azurewebsites.net/api/events/${id}`, {
          method: "DELETE",
          headers,
        })
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error("Failed to delete event: " + errorText)
        }
        // Optionally, update backend profiles as well
        for (const profile of profiles) {
          const updated: Partial<Profile> = {}
          let changed = false
          if (Array.isArray(profile.interestedEvents) && profile.interestedEvents.includes(id)) {
            updated.interestedEvents = profile.interestedEvents.filter((eid) => eid !== id)
            changed = true
          }
          if (Array.isArray(profile.goingToEvents) && profile.goingToEvents.includes(id)) {
            updated.goingToEvents = profile.goingToEvents.filter((eid) => eid !== id)
            changed = true
          }
          if (Array.isArray(profile.checkedInEvents) && profile.checkedInEvents.includes(id)) {
            updated.checkedInEvents = profile.checkedInEvents.filter((eid) => eid !== id)
            changed = true
          }
          if (changed) {
            await updateProfile(profile.id, updated)
          }
        }
        await fetchEvents()
        await fetchProfiles()
        return true
      } catch (err: any) {
        setEvents(prevEvents)
        setProfiles(prevProfiles)
        setError(err.message)
        return false
      } finally {
        setLoading(false)
      }
    },
    [profiles, updateProfile, fetchEvents, fetchProfiles, events]
  )

  useEffect(() => {
    fetchEvents()
    fetchProfiles()
  }, [fetchEvents, fetchProfiles])

  // Like an event: add to interestedEvents and increment interested count
  const likeEvent = useCallback(
    async (eventId: string, profileId: string) => {
      console.log("likeEvent called with:", { eventId, profileId })
      setLoading(true)
      setError(null)
      try {
        // Update profile
        setProfiles((prevProfiles) =>
          prevProfiles.map((profile) =>
            profile.id === profileId
              ? {
                  ...profile,
                  interestedEvents: Array.isArray(profile.interestedEvents)
                    ? [...new Set([...profile.interestedEvents, eventId])]
                    : [eventId],
                }
              : profile
          )
        )
        // Update event interested count
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  attendance: {
                    ...event.attendance,
                    interested: typeof event.attendance?.interested === "number" ? event.attendance.interested + 1 : 1,
                  },
                }
              : event
          )
        )

        await updateProfile(profileId, {
          interestedEvents: profiles.find((p) => p.id === profileId)?.interestedEvents ?? [eventId],
        })
        const eventObj = events.find((e) => e.id === eventId)
        if (eventObj) {
          const updatedEvent = {
            ...eventObj,
            attendance: {
              ...eventObj.attendance,
              interested:
                typeof eventObj.attendance?.interested === "number" ? (eventObj.attendance?.interested ?? 0) + 1 : 1,
            },
          }
          await updateEvent(eventId, updatedEvent)
        }
        await fetchEvents()
        await fetchProfiles()
      } catch (err: any) {
        console.error("likeEvent error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [updateProfile, updateEvent, fetchEvents, fetchProfiles, profiles, events]
  )

  // Dislike an event: add to notInterestedEvents
  const dislikeEvent = useCallback(
    async (eventId: string, profileId: string) => {
      setLoading(true)
      setError(null)
      try {
        setProfiles((prevProfiles) =>
          prevProfiles.map((profile) =>
            profile.id === profileId
              ? {
                  ...profile,
                  notInterestedEvents: Array.isArray(profile.notInterestedEvents)
                    ? [...new Set([...profile.notInterestedEvents, eventId])]
                    : [eventId],
                }
              : profile
          )
        )
        await updateProfile(profileId, {
          notInterestedEvents: profiles.find((p) => p.id === profileId)?.notInterestedEvents ?? [eventId],
        })
        await fetchProfiles()
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [updateProfile, fetchProfiles, profiles]
  )
  return (
    <AppDataContext.Provider
      value={{
        events,
        profiles,
        session,
        loading,
        error,
        fetchEvents,
        fetchProfiles,
        createEvent,
        updateEvent,
        deleteEvent,
        updateProfile,
        login,
        signup,
        logout,
        likeEvent,
        dislikeEvent,
      }}
    >
      {children}
    </AppDataContext.Provider>
  )
}
