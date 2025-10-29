import { Event, EventThemeName } from "./event"

export interface Filter {
  location: {
    useCurrentLocation: boolean
    customLocation?: {
      latitude: number
      longitude: number
    }
  }
  range: number
  eventThemes: EventThemeName[]
  dateRange: {
    todayOnly: boolean
    thisWeekendOnly: boolean
    custom?: {
      startDate: Date | null
      endDate: Date | null
    }
  }
  formats: {
    inperson: boolean
    online: boolean
    hybrid: boolean
  }
}
export interface EventFinderSettings {
  location: {
    useCurrentLocation: boolean
    customLocation?: {
      latitude: number
      longitude: number
    }
  }
  range: number
  eventThemes: EventThemeName[]
  dateRange: {
    todayOnly: boolean
    thisWeekendOnly: boolean
    custom?: {
      startDate: Date | null
      endDate: Date | null
    }
  }
  formats: {
    inperson: boolean
    online: boolean
    hybrid: boolean
  }
}

export interface Profile {
  id: string
  email: string
  name: string
  bio?: string
  phone?: string
  avatarUrl?: string
  eventFinderSettings?: EventFinderSettings
  likedEvents?: Event[]
  subscribedEvents?: Event[]
  filters?: Filter
}
