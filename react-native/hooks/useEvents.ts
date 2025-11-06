import { useSession } from "@/hooks/useSession"
import { Event } from "@/interfaces/event"
import { useCallback, useState } from "react"

export function useEvents() {
  const { session } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("https://plannr.azurewebsites.net/api/events", {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch events")
      const data = await response.json()
      // Map API response to local Event type
      const mapped = Array.isArray(data)
        ? data.map((event: any) => ({
            ...event,
            dateRange: {
              startAt: event.startAt ? new Date(event.startAt) : undefined,
              endAt: event.endAt ? new Date(event.endAt) : undefined,
            },
          }))
        : []
      setEvents(mapped)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [session])

  const createEvent = useCallback(
    async (fields: Omit<Event, "id">) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("https://plannr.azurewebsites.net/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify(fields),
        })
        if (!response.ok) throw new Error("Failed to create event")
        const data = await response.json()
        setEvents((prev) => [...prev, data])
        return data
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [session]
  )

  const updateEvent = useCallback(
    async (id: string, fields: Partial<Event>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`https://plannr.azurewebsites.net/api/events/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify(fields),
        })

        if (!response.ok) throw new Error("Failed to update event")
        const data = await response.json()
        setEvents((prev) => prev.map((e) => (e.id === id ? data : e)))
        return data
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [session]
  )

  const likeEvent = useCallback(
    async (id: string) => {
      const event = events.find((e) => e.id === id)
      if (!event) throw new Error("Event not found")
      const interested = (event.attendance?.interested ?? 0) + 1
      const attendance = {
        ...event.attendance,
        interested,
      }
      // Optimistically update local state
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, attendance: { ...attendance } } : e)))
      // Update backend
      await updateEvent(id, { attendance })
    },
    [events, updateEvent]
  )

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    likeEvent,
  }
}
