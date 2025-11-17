import type { EventFormat, EventTheme } from "@/interfaces/event"
import { DateRangeMode } from "@/interfaces/filter"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

export interface PreferencesData {
  range: number
  selectedThemes: EventTheme[]
  dateRangeMode: DateRangeMode
  eventTypes: EventFormat[]
  customStart: Date | null
  customEnd: Date | null
  customLocation: { latitude: number; longitude: number } | null
}

export interface PreferencesContextType extends PreferencesData {
  setRange: (v: number) => void
  setSelectedThemes: (v: EventTheme[]) => void
  setDateRangeMode: (v: DateRangeMode) => void
  setEventTypes: (v: EventFormat[]) => void
  setCustomStart: (v: Date | null) => void
  setCustomEnd: (v: Date | null) => void
  setCustomLocation: (loc: { latitude: number; longitude: number } | null) => void
  updateModeFromCustom: (start: Date | null, end: Date | null) => void
}

const defaultData: PreferencesData = {
  range: 50,
  selectedThemes: [],
  dateRangeMode: { daily: true },
  eventTypes: ["inperson"],
  customStart: null,
  customEnd: null,
  customLocation: null,
}

const STORAGE_KEY = "userPreferences"
const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<PreferencesData>(defaultData)

  // Load preferences from AsyncStorage on mount
  useEffect(() => {
    ;(async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setPrefs({ ...defaultData, ...JSON.parse(stored) })
        } catch {}
      }
    })()
  }, [])

  // Save preferences to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  }, [prefs])

  const setRange = useCallback((v: number) => setPrefs((p) => ({ ...p, range: v })), [])
  const setSelectedThemes = useCallback((v: EventTheme[]) => setPrefs((p) => ({ ...p, selectedThemes: v })), [])
  const setDateRangeMode = useCallback((v: DateRangeMode) => setPrefs((p) => ({ ...p, dateRangeMode: v })), [])
  const setEventTypes = useCallback((v: EventFormat[]) => setPrefs((p) => ({ ...p, eventTypes: v })), [])
  const setCustomStart = useCallback((v: Date | null) => setPrefs((p) => ({ ...p, customStart: v })), [])
  const setCustomEnd = useCallback((v: Date | null) => setPrefs((p) => ({ ...p, customEnd: v })), [])
  const setCustomLocation = useCallback(
    (loc: { latitude: number; longitude: number } | null) => setPrefs((p) => ({ ...p, customLocation: loc })),
    []
  )
  const updateModeFromCustom = useCallback(
    (start: Date | null, end: Date | null) => {
      if (start && end) {
        setDateRangeMode({ custom: true })
        setCustomStart(start)
        setCustomEnd(end)
      }
    },
    [setDateRangeMode, setCustomStart, setCustomEnd]
  )

  return (
    <PreferencesContext.Provider
      value={{
        ...prefs,
        setRange,
        setSelectedThemes,
        setDateRangeMode,
        setEventTypes,
        setCustomStart,
        setCustomEnd,
        setCustomLocation,
        updateModeFromCustom,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider")
  return ctx
}
