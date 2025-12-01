import type { Event } from "@interfaces/event"
import type { Profile } from "@interfaces/profile"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export function useProfileEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchProfileAndEvents() {
      try {
        const jwt = (session as any)?.jwt
        const profileId = (session as any)?.profileId
        if (!jwt || !profileId) {
          setEvents([])
          setLoading(false)
          return
        }
        const profileRes = await fetch(`/api/profiles/${profileId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        })
        const profile: Profile = await profileRes.json()
        const ids = [...(profile.interestedEvents ?? []), ...(profile.goingToEvents ?? [])]
        if (ids.length === 0) {
          setEvents([])
          setLoading(false)
          return
        }
        const eventsRes = await fetch(`/api/events?ids=${ids.join(",")}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        })
        const eventsData: Event[] = await eventsRes.json()
        setEvents(Array.isArray(eventsData) ? eventsData : [])
        setLoading(false)
      } catch {
        setEvents([])
        setLoading(false)
      }
    }
    fetchProfileAndEvents()
    // Only run when session changes
  }, [session])
  return { events, loading }
}
