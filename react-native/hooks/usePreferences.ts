// TypeScript interfaces for preferences
// TypeScript interfaces for preferences
export interface PreferencesData {
  range: number
  selectedThemes: EventTheme[]
  dateRangeMode: DateRangeMode
  eventTypes: EventFormat[]
  customStart: Date | null
  customEnd: Date | null
  customLocation: { latitude: number; longitude: number } | null
}

export interface PreferencesState extends PreferencesData {
  setRange: (v: number) => void
  setSelectedThemes: (v: EventTheme[]) => void
  setDateRangeMode: (v: DateRangeMode) => void
  setEventTypes: (v: EventFormat[]) => void
  setCustomStart: (v: Date | null) => void
  setCustomEnd: (v: Date | null) => void
  setCustomLocation: (loc: { latitude: number; longitude: number } | null) => void
  updateModeFromCustom: (start: Date | null, end: Date | null) => void
  reloadPreferences: () => Promise<void>
}
export interface PreferencesData {
  range: number
  selectedThemes: EventTheme[]
  dateRangeMode: DateRangeMode
  eventTypes: EventFormat[]
  customStart: Date | null
  customEnd: Date | null
  customLocation: { latitude: number; longitude: number } | null
}

export interface PreferencesState extends PreferencesData {
  setRange: (v: number) => void
  setSelectedThemes: (v: EventTheme[]) => void
  setDateRangeMode: (v: DateRangeMode) => void
  setEventTypes: (v: EventFormat[]) => void
  setCustomStart: (v: Date | null) => void
  setCustomEnd: (v: Date | null) => void
  setCustomLocation: (loc: { latitude: number; longitude: number } | null) => void
  updateModeFromCustom: (start: Date | null, end: Date | null) => void
}
import type { EventFormat, EventTheme } from "@/interfaces/event"
import { DateRangeMode } from "@/interfaces/filter"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { useCallback } from "react"
import { useAsyncStorage } from "./useAsyncStorage"
dayjs.extend(utc)

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
  const defaultData: PreferencesData = {
    range: 50,
    selectedThemes: [],
    dateRangeMode: { daily: true },
    eventTypes: ["inperson"],
    customStart: null,
    customEnd: null,
    customLocation: null,
    ...initial,
  }
  const [prefs, setPrefs, , , reloadPreferences] = useAsyncStorage<PreferencesData>("userPreferences", defaultData)

  const setRange = useCallback((v: number) => setPrefs({ ...prefs, range: v }), [prefs, setPrefs])
  const setSelectedThemes = useCallback(
    (v: EventTheme[]) => setPrefs({ ...prefs, selectedThemes: v }),
    [prefs, setPrefs]
  )
  const { normalizeDateRangeMode } = require("../utils/eventFilterUtils")
  const setDateRangeMode = useCallback(
    (v: DateRangeMode) => {
      const newMode = normalizeDateRangeMode(v)
      setPrefs((prev: PreferencesData) => ({
        ...prev,
        dateRangeMode: newMode,
      }))
    },
    [setPrefs]
  )
  const setEventTypes = useCallback((v: EventFormat[]) => setPrefs({ ...prefs, eventTypes: v }), [prefs, setPrefs])
  const setCustomStart = useCallback((v: Date | null) => setPrefs({ ...prefs, customStart: v }), [prefs, setPrefs])
  const setCustomEnd = useCallback((v: Date | null) => setPrefs({ ...prefs, customEnd: v }), [prefs, setPrefs])
  const setCustomLocation = useCallback(
    (loc: { latitude: number; longitude: number } | null) => setPrefs({ ...prefs, customLocation: loc }),
    [prefs, setPrefs]
  )
  const updateModeFromCustom = useCallback(
    (start: Date | null, end: Date | null) => {
      if (start && end) {
        setPrefs({
          ...prefs,
          dateRangeMode: { custom: true },
          customStart: start,
          customEnd: end,
        })
      }
    },
    [prefs, setPrefs]
  )

  return {
    range: prefs.range,
    setRange,
    selectedThemes: prefs.selectedThemes,
    setSelectedThemes,
    dateRangeMode: prefs.dateRangeMode,
    setDateRangeMode,
    eventTypes: prefs.eventTypes,
    setEventTypes,
    customStart: prefs.customStart,
    setCustomStart,
    customEnd: prefs.customEnd,
    setCustomEnd,
    customLocation: prefs.customLocation,
    setCustomLocation,
    updateModeFromCustom,
    reloadPreferences,
  }
}
