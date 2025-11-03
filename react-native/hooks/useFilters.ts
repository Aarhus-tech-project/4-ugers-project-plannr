import { EventFormat, EventLocation, EventThemeName } from "@/interfaces/event"
import { DateRangeMode, FilterDateRange, FilterLocation } from "@/interfaces/filter"
import { useCallback, useState } from "react"

export interface FiltersState {
  dateRange: FilterDateRange
  customStart: Date | null
  customEnd: Date | null
  mode: DateRangeMode
  range: FilterLocation["range"]
  selectedThemes: EventThemeName[]
  formats: EventFormat[]
  useCurrentLocation: boolean
  selectedLocation: Pick<EventLocation, "latitude" | "longitude"> | null
  setDateRange: (range: FilterDateRange) => void
  setCustomStart: (date: Date | null) => void
  setCustomEnd: (date: Date | null) => void
  setMode: (mode: DateRangeMode) => void
  setRange: (value: FilterLocation["range"]) => void
  setSelectedThemes: (themes: EventThemeName[]) => void
  setFormats: (formats: EventFormat[]) => void
  setUseCurrentLocation: (value: boolean) => void
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
  const [mode, setMode] = useState<DateRangeMode>(
    getModeFromDateRange(initial?.dateRange ?? { current: { day: true, week: false, month: false, year: false } })
  )
  const [range, setRange] = useState<FilterLocation["range"]>(initial?.range ?? 50)
  const [selectedThemes, setSelectedThemes] = useState<EventThemeName[]>(initial?.selectedThemes ?? [])
  const [formats, setFormats] = useState<EventFormat[]>(initial?.formats ?? [])
  const [useCurrentLocation, setUseCurrentLocation] = useState<boolean>(initial?.useCurrentLocation ?? true)
  const [selectedLocation, setSelectedLocation] = useState<Pick<EventLocation, "latitude" | "longitude"> | null>(
    initial?.selectedLocation ?? null
  )

  return {
    dateRange,
    customStart,
    customEnd,
    mode,
    range,
    selectedThemes,
    formats,
    useCurrentLocation,
    selectedLocation,
    setDateRange,
    setCustomStart,
    setCustomEnd,
    setMode,
    setRange,
    setSelectedThemes,
    setFormats,
    setUseCurrentLocation,
    setSelectedLocation,
  }
}
