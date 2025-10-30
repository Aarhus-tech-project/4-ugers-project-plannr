import { EventFormat, EventLocation, EventThemeName } from "@/interfaces/event"
import { DateRangeMode, FilterDateRange, FilterLocation } from "@/interfaces/filter"
import { useCallback, useState } from "react"

export interface FiltersState {
  dateRange: FilterDateRange
  setDateRange: (range: FilterDateRange) => void
  customStart: Date | null
  setCustomStart: (date: Date | null) => void
  customEnd: Date | null
  setCustomEnd: (date: Date | null) => void
  mode: DateRangeMode
  setMode: (mode: DateRangeMode) => void
  dateRangeMode: DateRangeMode | undefined
  range: FilterLocation["range"]
  setRange: (value: FilterLocation["range"]) => void
  selectedThemes: EventThemeName[]
  setSelectedThemes: (themes: EventThemeName[]) => void
  formats: EventFormat[]
  setFormats: (formats: EventFormat[]) => void
  useCurrentLocation: boolean
  setUseCurrentLocation: (value: boolean) => void
  selectedLocation: Pick<EventLocation, "latitude" | "longitude"> | null
  setSelectedLocation: (loc: Pick<EventLocation, "latitude" | "longitude"> | null) => void
}

export function useFilters(initial?: Partial<FiltersState>): FiltersState {
  const [dateRange, setDateRange] = useState<FilterDateRange>(
    initial?.dateRange ?? { current: { day: true, week: false, month: false, year: false } }
  )
  const [customStart, setCustomStart] = useState<Date | null>(initial?.customStart ?? null)
  const [customEnd, setCustomEnd] = useState<Date | null>(initial?.customEnd ?? null)
  const getModeFromDateRange = useCallback((dateRange: FilterDateRange): DateRangeMode => {
    if (dateRange.current?.day) return { daily: true }
    if (dateRange.current?.week) return { weekly: true }
    if (dateRange.current?.month) return { monthly: true }
    if (dateRange.current?.year) return { yearly: true }
    if (dateRange.custom !== undefined) return { custom: true }
    return { daily: true }
  }, [])
  const [mode, _setMode] = useState<DateRangeMode>(
    getModeFromDateRange(initial?.dateRange ?? { current: { day: true, week: false, month: false, year: false } })
  )
  const setMode = useCallback((newMode: DateRangeMode) => {
    _setMode(newMode)
    // Optionally update dateRange here if you want to sync
    // For now, just update mode
  }, [])
  const [range, setRange] = useState<FilterLocation["range"]>(initial?.range ?? 50)
  const [selectedThemes, setSelectedThemes] = useState<EventThemeName[]>(initial?.selectedThemes ?? [])
  const [formats, setFormats] = useState<EventFormat[]>(initial?.formats ?? [])
  const [useCurrentLocation, setUseCurrentLocation] = useState<boolean>(initial?.useCurrentLocation ?? true)
  const [selectedLocation, setSelectedLocation] = useState<Pick<EventLocation, "latitude" | "longitude"> | null>(
    initial?.selectedLocation ?? null
  )

  return {
    dateRange,
    setDateRange,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    mode,
    setMode,
    dateRangeMode: mode,
    range,
    setRange,
    selectedThemes,
    setSelectedThemes,
    formats,
    setFormats,
    useCurrentLocation,
    setUseCurrentLocation,
    selectedLocation,
    setSelectedLocation,
  }
}
