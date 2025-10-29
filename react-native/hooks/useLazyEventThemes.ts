import { eventThemes } from "@/utils/event-content"
import { useEffect, useState } from "react"

export function useLazyEventThemes(initialCount = 10, delay = 600) {
  const [visibleThemes, setVisibleThemes] = useState(eventThemes.slice(0, initialCount))
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded && eventThemes.length > initialCount) {
      const id = setTimeout(() => {
        setVisibleThemes(eventThemes)
        setLoaded(true)
      }, delay)
      return () => clearTimeout(id)
    }
  }, [loaded, initialCount, delay])

  const loadAll = () => {
    setVisibleThemes(eventThemes)
    setLoaded(true)
  }

  return { visibleThemes, loadAll, loaded }
}
