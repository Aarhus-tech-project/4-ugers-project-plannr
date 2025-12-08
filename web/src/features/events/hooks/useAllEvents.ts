import { eventsService } from "@/lib/api/services/events"
import type { Event } from "@/shared/types"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

/**
 * Hook to fetch ALL events (not just user's interested/going events)
 * Used for the public events discovery page
 * Note: Authentication is optional - will work for both logged in and guest users
 */
export function useAllEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    async function fetchAllEvents() {
      // Wait for session to be determined (loading, authenticated, or unauthenticated)
      if (status === "loading") {
        return
      }

      try {
        setLoading(true)
        setError(null)

        // JWT is optional - backend should allow public access to events
        const jwt = session?.jwt

        // Fetch all events without filtering by IDs
        const eventsData = await eventsService.getAll(jwt)
        setEvents(Array.isArray(eventsData) ? eventsData : [])
        setLoading(false)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch events"
        console.error("Failed to fetch events:", errorMessage)
        setError(errorMessage)
        setEvents([])
        setLoading(false)
      }
    }

    fetchAllEvents()
  }, [session, status])

  // Function to update a specific event's attendance
  const updateEventAttendance = (eventId: string, goingDelta: number, interestedDelta: number) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            attendance: {
              ...event.attendance,
              going: (event.attendance?.going || 0) + goingDelta,
              interested: (event.attendance?.interested || 0) + interestedDelta,
            },
          }
        }
        return event
      })
    )
  }

  return { events, loading, error, updateEventAttendance }
}
