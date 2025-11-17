import { EventFormat, EventLocation, EventTheme } from "@/interfaces/event"
import { DateRangeMode } from "@/interfaces/filter"

// Filter events nearby (within a given distance in km)
export function filterEventsNearby(events: any[], liveLocation: any, maxDistanceKm: number = 100): any[] {
  if (!liveLocation?.coords) return []
  return events.filter((e) => {
    if (!e.location || typeof e.location.latitude !== "number" || typeof e.location.longitude !== "number") return false
    const distance =
      getDistance(
        liveLocation.coords.latitude,
        liveLocation.coords.longitude,
        e.location.latitude,
        e.location.longitude
      ) / 1000 // convert meters to km
    return distance <= maxDistanceKm
  })
}

// Distance calculation (Haversine)
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // metres
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // in meters
}

// Normalize date range mode
export function normalizeDateRangeMode(mode: DateRangeMode): DateRangeMode {
  if (mode.daily) return { daily: true, weekly: false, monthly: false, yearly: false, custom: false }
  if (mode.weekly) return { daily: false, weekly: true, monthly: false, yearly: false, custom: false }
  if (mode.monthly) return { daily: false, weekly: false, monthly: true, yearly: false, custom: false }
  if (mode.yearly) return { daily: false, weekly: false, monthly: false, yearly: true, custom: false }
  if (mode.custom) return { daily: false, weekly: false, monthly: false, yearly: false, custom: true }
  return { daily: true, weekly: false, monthly: false, yearly: false, custom: false }
}

// Filter by event type
export function filterByType(eventTypes: EventFormat[], eventFormat: EventFormat): boolean {
  return eventTypes.length === 0 || eventTypes.includes(eventFormat)
}

// Filter by theme
export function filterByTheme(selectedThemes: any[], eventThemes: string[]): boolean {
  // If no themes selected, allow all events
  if (!selectedThemes || selectedThemes.length === 0) return true
  // selectedThemes: [{name: string}], eventThemes: [string]
  const selectedNames = selectedThemes.map((t: any) => (typeof t === "string" ? t : t.name))
  return eventThemes?.some((theme) => selectedNames.includes(theme))
}

// Filter by date range
export function filterByDateRange(
  mode: DateRangeMode,
  customStart: Date | null,
  customEnd: Date | null,
  eventStart: Date | null,
  eventEnd: Date | null
): boolean {
  if (!eventStart) return false
  if (mode.custom && customStart) {
    if (!eventEnd) return false
    // Convert all to Date objects if needed
    const customStartDate = typeof customStart === "string" ? new Date(customStart) : customStart
    const customEndDate = customEnd ? (typeof customEnd === "string" ? new Date(customEnd) : customEnd) : null
    const eventStartDate = typeof eventStart === "string" ? new Date(eventStart) : eventStart
    const eventEndDate = typeof eventEnd === "string" ? new Date(eventEnd) : eventEnd
    // If customEnd is null, treat as open-ended
    if (!customEndDate) {
      return eventEndDate >= customStartDate
    }
    // Overlap logic: event overlaps custom range
    return eventStartDate <= customEndDate && eventEndDate >= customStartDate
  }
  const now = new Date()
  if (mode.daily) return eventStart.toDateString() === now.toDateString()
  if (mode.weekly) {
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return eventStart >= weekStart && eventStart <= weekEnd
  }
  if (mode.monthly) return eventStart.getMonth() === now.getMonth() && eventStart.getFullYear() === now.getFullYear()
  if (mode.yearly) return eventStart.getFullYear() === now.getFullYear()
  return true
}

// Filter by location
export function filterByLocation(
  userLat: number | null,
  userLon: number | null,
  eventLocation: EventLocation | undefined,
  rangeKm: number
): boolean {
  if (userLat === null || userLon === null || !eventLocation?.latitude || !eventLocation?.longitude) return true // No location filter
  const distance = getDistance(userLat, userLon, eventLocation.latitude, eventLocation.longitude)
  const passes = distance <= rangeKm * 1000
  return passes
}

// Master filter function
export function filterEvents(
  events: any[],
  {
    eventTypes,
    selectedThemes,
    dateRangeMode,
    customStart,
    customEnd,
    customLocation,
    liveLocation,
    range,
  }: {
    eventTypes: EventFormat[]
    selectedThemes: EventTheme[]
    dateRangeMode: DateRangeMode
    customStart: Date | null
    customEnd: Date | null
    customLocation: { latitude: number; longitude: number } | null
    liveLocation: any
    range: number
  }
): any[] {
  let userLat: number | null = null
  let userLon: number | null = null
  if (customLocation) {
    userLat = customLocation.latitude
    userLon = customLocation.longitude
  } else if (liveLocation) {
    userLat = liveLocation.coords.latitude
    userLon = liveLocation.coords.longitude
  }
  return events.filter((event) => {
    const typePass = filterByType(eventTypes, event.format)
    const themePass = filterByTheme(selectedThemes, event.themes || [])
    let start = null
    let end = null
    if (event.dateRange?.startAt && event.dateRange?.endAt) {
      start = new Date(event.dateRange.startAt)
      end = new Date(event.dateRange.endAt)
    } else if (event.startAt && event.endAt) {
      start = new Date(event.startAt)
      end = new Date(event.endAt)
    }
    const datePass = filterByDateRange(dateRangeMode, customStart, customEnd, start, end)
    const locationPass = filterByLocation(userLat, userLon, event.location, range)
    if (!typePass) return false
    if (!themePass) return false
    if (!datePass) return false
    if (!locationPass) return false
    return true
  })
}
