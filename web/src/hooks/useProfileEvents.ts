import { eventsService } from "@/lib/api/services/events"
import { profilesService } from "@/lib/api/services/profiles"
import type { Event } from "@/lib/types"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export function useProfileEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchProfileAndEvents() {
      try {
        const jwt = session?.jwt
        const profileId = session?.profileId

        if (!jwt || !profileId) {
          setEvents([])
          setLoading(false)
          return
        }

        const profile = await profilesService.getById(profileId, jwt)

        const ids = [...(profile.interestedEvents ?? []), ...(profile.goingToEvents ?? [])]

        if (ids.length === 0) {
          setEvents([])
          setLoading(false)
          return
        }

        const eventsData = await eventsService.getAll(jwt, { ids: ids.join(",") })
        setEvents(Array.isArray(eventsData) ? eventsData : [])
        setLoading(false)
      } catch {
        setEvents([])
        setLoading(false)
      }
    }

    fetchProfileAndEvents()
  }, [session])

  return { events, loading }
}
