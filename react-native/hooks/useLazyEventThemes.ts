import { eventThemes } from "@/utils/event-content"
import { useEffect, useState } from "react"

export function useLazyEventThemes(initialCount = 10, delay = 600) {
  // Always return at least the initial themes instantly
  const [visibleThemes, setVisibleThemes] = useState(() => eventThemes.slice(0, initialCount))
  // If all themes are already present, loaded should be true
  const [loaded, setLoaded] = useState(() => eventThemes.length <= initialCount)

  useEffect(() => {
    // If already loaded, do nothing
    if (loaded) return
    // If there are more themes to load, load them after a delay
    const id = setTimeout(() => {
      setVisibleThemes(eventThemes)
      setLoaded(true)
    }, delay)
    return () => clearTimeout(id)
  }, [loaded, initialCount, delay])

  const loadAll = () => {
    setVisibleThemes(eventThemes)
    setLoaded(true)
  }

  return { visibleThemes, loadAll, loaded }
}
