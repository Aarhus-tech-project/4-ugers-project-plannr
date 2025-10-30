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
}

export function usePreferences(initial?: Partial<PreferencesState>) {
  const defaultState: PreferencesState = {
    range: 50,
    selectedThemes: [],
    dateRangeMode: { daily: true },
    eventType: "inperson",
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

  // Always store and return UTC dates
  const getRangeForMode = useCallback(
    (mode: DateRangeMode): { start: Date; end: Date } => {
      const nowLocal = dayjs()
      if (mode.daily) {
        return {
          start: nowLocal.startOf("day").utc().toDate(),
          end: nowLocal.endOf("day").utc().toDate(),
        }
      } else if (mode.weekly) {
        return {
          start: nowLocal.startOf("week").utc().toDate(),
          end: nowLocal.endOf("week").utc().toDate(),
        }
      } else if (mode.monthly) {
        return {
          start: nowLocal.startOf("month").utc().toDate(),
          end: nowLocal.endOf("month").utc().toDate(),
        }
      } else if (mode.yearly) {
        return {
          start: nowLocal.startOf("year").utc().toDate(),
          end: nowLocal.endOf("year").utc().toDate(),
        }
      } else {
        return {
          start: customStart
            ? dayjs(customStart).startOf("day").utc().toDate()
            : nowLocal.startOf("day").utc().toDate(),
          end: customEnd ? dayjs(customEnd).endOf("day").utc().toDate() : nowLocal.endOf("day").utc().toDate(),
        }
      }
    },
    [customStart, customEnd]
  )

  // Set mode and update customStart/customEnd accordingly
  const setDateRangeModeAndUpdate = useCallback(
    (mode: DateRangeMode) => {
      setDateRangeMode(mode)
      const { start, end } = getRangeForMode(mode)
      setCustomStart(start)
      setCustomEnd(end)
    },
    [getRangeForMode]
  )

  // Set custom start/end (calendar already provides UTC dates)
  const setCustomStartRaw = useCallback((date: Date | null) => {
    setCustomStart(date)
  }, [])
  const setCustomEndRaw = useCallback((date: Date | null) => {
    setCustomEnd(date)
  }, [])

  // When customStart/customEnd change, update mode if needed
  const updateModeFromCustom = useCallback((start: Date | null, end: Date | null) => {
    if (!start || !end) return setDateRangeMode({ custom: true })
    const now = dayjs.utc()
    if (dayjs.utc(start).isSame(now, "minute") && dayjs.utc(end).isSame(now.endOf("day"), "minute")) {
      setDateRangeMode({ daily: true })
    } else if (dayjs.utc(start).isSame(now, "minute") && dayjs.utc(end).isSame(now.endOf("week"), "minute")) {
      setDateRangeMode({ weekly: true })
    } else if (dayjs.utc(start).isSame(now, "minute") && dayjs.utc(end).isSame(now.endOf("month"), "minute")) {
      setDateRangeMode({ monthly: true })
    } else if (dayjs.utc(start).isSame(now, "minute") && dayjs.utc(end).isSame(now.endOf("year"), "minute")) {
      setDateRangeMode({ yearly: true })
    } else {
      setDateRangeMode({ custom: true })
    }
  }, [])

  const resetPreferences = () => {
    setRange(defaultState.range)
    setSelectedThemes(defaultState.selectedThemes)
    setDateRangeMode(defaultState.dateRangeMode)
    setEventType(defaultState.eventType)
    setCustomStart(defaultState.customStart)
    setCustomEnd(defaultState.customEnd)
  }

  const isChanged =
    range !== defaultState.range ||
    dateRangeMode !== defaultState.dateRangeMode ||
    eventType !== defaultState.eventType ||
    selectedThemes.length !== defaultState.selectedThemes.length ||
    selectedThemes.some((theme) => !defaultState.selectedThemes.some((t) => t.name === theme.name)) ||
    customStart !== defaultState.customStart ||
    customEnd !== defaultState.customEnd

  return {
    range,
    setRange,
    selectedThemes,
    setSelectedThemes,
    dateRangeMode,
    setDateRangeMode: setDateRangeModeAndUpdate,
    getRangeForMode,
    eventType,
    setEventType,
    customStart,
    setCustomStart: setCustomStartRaw,
    customEnd,
    setCustomEnd: setCustomEndRaw,
    updateModeFromCustom,
    resetPreferences,
    isChanged,
  }
}
