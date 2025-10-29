import { EventFormat } from "@/interfaces/event"
import { useState } from "react"

const dateRanges = ["Today", "This Week", "Custom"]

export interface PreferencesState {
  rangeKm: number
  selectedThemes: string[]
  dateRange: string
  eventType: EventFormat
  customStart: Date | null
  customEnd: Date | null
}

export function usePreferences(initial?: Partial<PreferencesState>) {
  const defaultState: PreferencesState = {
    rangeKm: 10,
    selectedThemes: [],
    dateRange: dateRanges[0],
    eventType: "inperson",
    customStart: null,
    customEnd: null,
    ...initial,
  }
  const [rangeKm, setRangeKm] = useState(defaultState.rangeKm)
  const [selectedThemes, setSelectedThemes] = useState<string[]>(defaultState.selectedThemes)
  const [dateRange, setDateRange] = useState(defaultState.dateRange)
  const [eventType, setEventType] = useState<EventFormat>(defaultState.eventType)
  const [customStart, setCustomStart] = useState<Date | null>(defaultState.customStart)
  const [customEnd, setCustomEnd] = useState<Date | null>(defaultState.customEnd)

  const resetPreferences = () => {
    setRangeKm(defaultState.rangeKm)
    setSelectedThemes(defaultState.selectedThemes)
    setDateRange(defaultState.dateRange)
    setEventType(defaultState.eventType)
    setCustomStart(defaultState.customStart)
    setCustomEnd(defaultState.customEnd)
  }

  const isChanged =
    rangeKm !== defaultState.rangeKm ||
    dateRange !== defaultState.dateRange ||
    eventType !== defaultState.eventType ||
    selectedThemes.length !== defaultState.selectedThemes.length ||
    selectedThemes.some((theme) => !defaultState.selectedThemes.includes(theme)) ||
    customStart !== defaultState.customStart ||
    customEnd !== defaultState.customEnd

  return {
    rangeKm,
    setRangeKm,
    selectedThemes,
    setSelectedThemes,
    dateRange,
    setDateRange,
    eventType,
    setEventType,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    resetPreferences,
    isChanged,
  }
}
