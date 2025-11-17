import { api } from "@/config/api"
import { useCallback } from "react"
import { useAsyncFn } from "./useAsyncFn"

export function useEvents() {
  const fetchEventsFn = useCallback(() => api.events.list(), [])
  const createEventFn = useCallback((event: any) => api.events.create(event), [])
  const updateEventFn = useCallback((id: string, data: any) => api.events.update(id, data), [])
  const deleteEventFn = useCallback((id: string) => api.events.delete(id), [])
  const likeEventFn = useCallback(
    (userId: string, interestedEvents: any[], eventId: string) => api.likeEvent(userId, interestedEvents, eventId),
    []
  )

  const fetchEvents = useAsyncFn(fetchEventsFn)
  const createEvent = useAsyncFn(createEventFn)
  const updateEvent = useAsyncFn(updateEventFn)
  const deleteEvent = useAsyncFn(deleteEventFn)
  const likeEvent = useAsyncFn(likeEventFn)

  return { fetchEvents, createEvent, updateEvent, deleteEvent, likeEvent }
}
