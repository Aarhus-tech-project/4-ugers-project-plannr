import { EventThemeName } from "./event"

export interface ProfileSettings {
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

import { Event } from "./event"

export interface Profile {
  id: string
  email: string
  name: string
  bio?: string
  phone?: string
  avatarUrl?: string
  settings?: ProfileSettings
  likedEvents?: Event[]
  subscribedEvents?: Event[]
}
