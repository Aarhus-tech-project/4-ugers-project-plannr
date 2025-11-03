import type { EventFormat, EventTheme } from "@/interfaces/event"
import { DateRangeMode } from "@/interfaces/filter"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { useCallback, useState } from "react"
dayjs.extend(utc)

export interface PreferencesState {
  range: number
  selectedThemes: EventTheme[]
  dateRangeMode: DateRangeMode
  eventType: EventFormat
  customStart: Date | null // always UTC
  customEnd: Date | null // always UTC
  setRange: (v: number) => void
  setSelectedThemes: (v: EventTheme[]) => void
  setDateRangeMode: (v: DateRangeMode) => void
  setEventType: (v: EventFormat) => void
  setCustomStart: (v: Date | null) => void
  setCustomEnd: (v: Date | null) => void
  updateModeFromCustom: (start: Date | null, end: Date | null) => void
}

export function usePreferences(
  initial?: Partial<
    Omit<
      PreferencesState,
      | "setRange"
      | "setSelectedThemes"
      | "setDateRangeMode"
      | "setEventType"
      | "setCustomStart"
      | "setCustomEnd"
      | "updateModeFromCustom"
    >
  >
): PreferencesState {
  const defaultState = {
    range: 50,
    selectedThemes: [],
    dateRangeMode: { daily: true },
    eventType: "inperson" as EventFormat,
    customStart: null,
    customEnd: null,
    ...initial,
  }
  const [range, setRange] = useState(defaultState.range)
  const [selectedThemes, setSelectedThemes] = useState<EventTheme[]>(defaultState.selectedThemes)
  const [dateRangeMode, setDateRangeMode] = useState<DateRangeMode>(defaultState.dateRangeMode)
  const [eventType, setEventType] = useState<EventFormat>(defaultState.eventType)
  const [customStart, setCustomStart] = useState<Date | null>(defaultState.customStart)
  const [customEnd, setCustomEnd] = useState<Date | null>(defaultState.customEnd)

  // Set mode and update customStart/customEnd accordingly
  const updateModeFromCustom = useCallback((start: Date | null, end: Date | null) => {
    if (start && end) {
      setDateRangeMode({ custom: true })
      setCustomStart(start)
      setCustomEnd(end)
    }
  }, [])

  return {
    range,
    setRange,
    selectedThemes,
    setSelectedThemes,
    dateRangeMode,
    setDateRangeMode,
    eventType,
    setEventType,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    updateModeFromCustom,
  }
}
