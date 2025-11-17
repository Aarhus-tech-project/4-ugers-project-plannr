import { useCustomTheme } from "@/hooks/useCustomTheme"
import { getDisabledDates } from "@/utils/calendar-disabled"
import dayjs from "dayjs"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import utc from "dayjs/plugin/utc"
import React, { useState } from "react"
import { View } from "react-native"
import { Calendar } from "react-native-calendars"
import { Theme as CalendarTheme } from "react-native-calendars/src/types"
import { Text } from "react-native-paper"
import { WheelTimePicker } from "./WheelTimePicker"
dayjs.extend(isSameOrBefore)
dayjs.extend(utc)

interface CustomDateRangeCalendarProps {
  customStart: Date | null
  customEnd: Date | null
  onStartChange: (date: Date | null) => void
  onEndChange: (date: Date | null) => void
  allDay?: boolean
}

const CustomDateRangeCalendar: React.FC<CustomDateRangeCalendarProps> = ({
  customStart,
  customEnd,
  onStartChange,
  onEndChange,
  allDay = false,
}) => {
  const theme = useCustomTheme()
  const darkMode = theme.dark
  // Local state for time pickers
  // Modal state for hour/minute selection removed (now using dropdown)
  // Default to 12:00 for new selections
  const [startTime, setStartTime] = useState<Date | null>(customStart ? dayjs(customStart).toDate() : null)
  const [endTime, setEndTime] = useState<Date | null>(customEnd ? dayjs(customEnd).toDate() : null)

  // Keep local time state in sync with props
  // When customStart/customEnd change, or if they are reset (e.g. by mode change), update local time state
  React.useEffect(() => {
    setStartTime(customStart ? dayjs(customStart).toDate() : null)
    if (customEnd) {
      setEndTime(dayjs(customEnd).toDate())
    } else if (customStart) {
      // If no end time, default to 24:00 (next day at 00:00) for the selected start day
      setEndTime(dayjs(customStart).add(1, "day").startOf("day").toDate())
    } else {
      setEndTime(null)
    }
  }, [customStart, customEnd])

  // Use markingType='period' and selected for single day
  const markedDates = React.useMemo(() => {
    const dates: Record<string, any> = {}
    if (customStart && !customEnd) {
      const start = dayjs(customStart).format("YYYY-MM-DD")
      dates[start] = {
        selected: true,
        startingDay: true,
        endingDay: true,
        color: theme.colors.brand.red,
        textColor: theme.colors.background,
      }
    } else if (customStart && customEnd) {
      const start = dayjs(customStart).startOf("day")
      const end = dayjs(customEnd).startOf("day")
      let current = start
      while (current.isSameOrBefore(end, "day")) {
        const key = current.format("YYYY-MM-DD")
        const isFirst = key === start.format("YYYY-MM-DD")
        const isLast = key === end.format("YYYY-MM-DD")
        dates[key] = {
          ...(isFirst ? { startingDay: true } : {}),
          ...(isLast ? { endingDay: true } : {}),
          color: theme.colors.brand.red,
          textColor: theme.colors.background,
        }
        current = current.add(1, "day")
      }
    }
    Object.assign(dates, getDisabledDates({ disabledDates: [] }))
    return dates
  }, [customStart, customEnd, allDay, theme])

  const calendarTheme: CalendarTheme = {
    calendarBackground: "transparent",
    monthTextColor: theme.colors.brand.red,
    selectedDayBackgroundColor: theme.colors.brand.red,
    selectedDayTextColor: theme.colors.background,
    dayTextColor: theme.colors.onBackground,
    textDisabledColor: darkMode ? theme.colors.gray[700] : theme.colors.gray[200],
    todayTextColor: theme.colors.brand.red,
    arrowColor: theme.colors.brand.red,
    textDayFontSize: 16,
    textMonthFontWeight: "bold",
  }

  const calendarStyle = React.useMemo(
    () => ({
      backgroundColor: "transparent",
      shadowOpacity: 0,
    }),
    [theme]
  )

  const handleDayPress = React.useCallback(
    (day: { dateString: string }) => {
      const selectedLocal = dayjs(day.dateString)
      if (allDay) {
        onStartChange(selectedLocal.startOf("day").utc().toDate())
        onEndChange(null)
        return
      }
      if (!customStart && !customEnd) {
        // No range yet, set only start (00:00:00.000 local) and leave end null
        const base = selectedLocal.hour(0).minute(0).second(0).millisecond(0)
        onStartChange(base.utc().toDate())
        onEndChange(null)
      } else if (customStart && !customEnd) {
        const startDay = dayjs(customStart).startOf("day")
        if (selectedLocal.isBefore(startDay)) {
          // Extend start
          const newStart = selectedLocal.hour(startTime?.getHours() ?? 0).minute(startTime?.getMinutes() ?? 0)
          onStartChange(newStart.utc().toDate())
        } else if (selectedLocal.isAfter(startDay)) {
          // Extend end
          const newEnd = selectedLocal
            .hour(endTime?.getHours() ?? 23)
            .minute(endTime?.getMinutes() ?? 59)
            .second(59)
            .millisecond(999)
          // Set end to 23:59:59.999 local time, then convert to UTC
          onEndChange(newEnd.utc().toDate())
        } else {
          // Clicked same day: reset to single day selection (00:00:00.000–23:59:59.999 local)
          const base = selectedLocal.hour(0).minute(0).second(0).millisecond(0)
          onStartChange(base.utc().toDate())
          const end = selectedLocal.hour(23).minute(59).second(59).millisecond(999)
          // Set end to 23:59:59.999 local time, then convert to UTC
          onEndChange(end.utc().toDate())
        }
      } else if (customStart && customEnd) {
        const startDay = dayjs(customStart).startOf("day")
        const endDay = dayjs(customEnd).startOf("day")
        if (selectedLocal.isBefore(startDay)) {
          // Extend start only
          const newStart = selectedLocal.hour(startTime?.getHours() ?? 0).minute(startTime?.getMinutes() ?? 0)
          onStartChange(newStart.utc().toDate())
        } else if (selectedLocal.isAfter(endDay)) {
          // Extend end only
          const newEnd = selectedLocal.hour(endTime?.getHours() ?? 23).minute(endTime?.getMinutes() ?? 59)
          onEndChange(newEnd.utc().toDate())
        } else if (
          selectedLocal.isSame(startDay) ||
          selectedLocal.isSame(endDay) ||
          (selectedLocal.isAfter(startDay) && selectedLocal.isBefore(endDay))
        ) {
          // Clicked inside the range: reset start to this date, clear end
          const newStart = selectedLocal.hour(startTime?.getHours() ?? 0).minute(startTime?.getMinutes() ?? 0)
          onStartChange(newStart.utc().toDate())
          onEndChange(null)
        }
      }
    },
    [allDay, customStart, customEnd, startTime, endTime, onStartChange, onEndChange]
  )

  return (
    <View>
      <Calendar
        markingType={"period"}
        minDate={dayjs().toISOString()}
        hideExtraDays
        firstDay={1}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={calendarTheme}
        style={calendarStyle}
      />
      {/* Unified dropdown for hour/minute selection for start and end (if not allDay) */}
      {!allDay && (
        <View
          style={{ marginTop: 16, flexDirection: "row", gap: 16, alignItems: "flex-end", justifyContent: "center" }}
        >
          {/* Start Time Picker */}
          {customStart && (
            <View style={{ marginBottom: 0, flex: 1 }}>
              <Text style={{ color: theme.colors.onBackground, fontWeight: "bold", marginBottom: 4 }}>Start Time</Text>
              <WheelTimePicker
                value={startTime}
                onChange={(date) => {
                  setStartTime(date)
                  onStartChange(dayjs(date).utc().toDate())
                }}
              />
            </View>
          )}
          {/* End Time Picker */}
          {(customEnd ||
            (customStart && (!customEnd || (customEnd && dayjs(customStart).isSame(customEnd, "day"))))) && (
            <View style={{ marginBottom: 0, flex: 1, justifyContent: "flex-start" }}>
              <Text
                style={{
                  color: theme.colors.onBackground,
                  fontWeight: "bold",
                  marginBottom: 4,
                }}
              >
                End Time
              </Text>
              <WheelTimePicker
                value={endTime}
                min={startTime ?? undefined}
                onChange={(date) => {
                  setEndTime(date)
                  onEndChange(dayjs(date).utc().toDate())
                }}
              />
            </View>
          )}
        </View>
      )}
    </View>
  )
}

export default CustomDateRangeCalendar
