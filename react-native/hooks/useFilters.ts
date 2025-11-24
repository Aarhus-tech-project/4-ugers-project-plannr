import { useCallback, useState } from "react"
import { EventFormat, EventLocation, EventThemeName } from "../interfaces/event"
import { DateRangeMode, FilterDateRange, FilterLocation } from "../interfaces/filter"

type FiltersData = {
  dateRange: FilterDateRange
  customStart: Date | null
  customEnd: Date | null
  mode: DateRangeMode
  range: FilterLocation["range"]
  selectedThemes: EventThemeName[]
  formats: EventFormat[]
  useCurrentLocation: boolean
  selectedLocation: Pick<EventLocation, "latitude" | "longitude"> | null
}

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
  const [filters, setFilters] = useState<FiltersData>({
    dateRange: initial?.dateRange ?? { current: { day: true, week: false, month: false, year: false } },
    customStart: initial?.customStart ?? null,
    customEnd: initial?.customEnd ?? null,
    mode: initial?.mode ?? { daily: true },
    range: initial?.range ?? 50,
    selectedThemes: initial?.selectedThemes ?? [],
    formats: initial?.formats ?? [],
    useCurrentLocation: initial?.useCurrentLocation ?? true,
    selectedLocation: initial?.selectedLocation ?? null,
  })

  const setDateRange = useCallback(
    (range: FilterDateRange) => setFilters((prev) => ({ ...prev, dateRange: range })),
    []
  )
  const setCustomStart = useCallback((date: Date | null) => setFilters((prev) => ({ ...prev, customStart: date })), [])
  const setCustomEnd = useCallback((date: Date | null) => setFilters((prev) => ({ ...prev, customEnd: date })), [])
  const { normalizeDateRangeMode } = require("../utils/eventFilterUtils")
  const setMode = useCallback(
    (mode: DateRangeMode) => {
      const newMode = normalizeDateRangeMode(mode)
      let newDateRange: FilterDateRange
      if (newMode.custom) {
        newDateRange = { custom: { startDate: filters.customStart, endDate: filters.customEnd } }
      } else if (newMode.daily) {
        newDateRange = { current: { day: true, week: false, month: false, year: false } }
      } else if (newMode.weekly) {
        newDateRange = { current: { day: false, week: true, month: false, year: false } }
      } else if (newMode.monthly) {
        newDateRange = { current: { day: false, week: false, month: true, year: false } }
      } else if (newMode.yearly) {
        newDateRange = { current: { day: false, week: false, month: false, year: true } }
      } else {
        newDateRange = { current: { day: true, week: false, month: false, year: false } }
      }
      setFilters((prev: FiltersData) => ({
        ...prev,
        mode: newMode,
        dateRange: newDateRange,
      }))
    },
    [filters.customStart, filters.customEnd]
  )
  const setRange = useCallback(
    (value: FilterLocation["range"]) => setFilters((prev) => ({ ...prev, range: value })),
    []
  )
  const setSelectedThemes = useCallback(
    (themes: EventThemeName[]) => setFilters((prev) => ({ ...prev, selectedThemes: themes })),
    []
  )
  const setFormats = useCallback((formats: EventFormat[]) => setFilters((prev) => ({ ...prev, formats })), [])
  const setUseCurrentLocation = useCallback(
    (value: boolean) => setFilters((prev) => ({ ...prev, useCurrentLocation: value })),
    []
  )
  const setSelectedLocation = useCallback(
    (loc: Pick<EventLocation, "latitude" | "longitude"> | null) =>
      setFilters((prev) => ({ ...prev, selectedLocation: loc })),
    []
  )

  return {
    dateRange: filters.dateRange,
    setDateRange,
    customStart: filters.customStart,
    setCustomStart,
    customEnd: filters.customEnd,
    setCustomEnd,
    mode: filters.mode,
    setMode,
    range: filters.range,
    setRange,
    selectedThemes: filters.selectedThemes,
    setSelectedThemes,
    formats: filters.formats,
    setFormats,
    useCurrentLocation: filters.useCurrentLocation,
    setUseCurrentLocation,
    selectedLocation: filters.selectedLocation,
    setSelectedLocation,
  }
}
