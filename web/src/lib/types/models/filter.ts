import type { EventFormat, EventThemeName } from "./event"

export type DateRangeMode = {
  daily?: boolean
  weekly?: boolean
  monthly?: boolean
  yearly?: boolean
  custom?: boolean
}

export interface FilterLocation {
  useCurrent?: boolean
  range?: number
  custom?: {
    latitude: number
    longitude: number
  }
}

export interface FilterDateRange {
  current?: {
    day: boolean
    week: boolean
    month: boolean
    year: boolean
  }
  custom?: {
    startDate: Date | null
    endDate: Date | null
  }
}

export interface Filter {
  location: FilterLocation
  eventThemes: EventThemeName[]
  dateRange: FilterDateRange
  formats: EventFormat[]
}
