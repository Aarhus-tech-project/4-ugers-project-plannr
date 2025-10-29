import { useCustomTheme } from "@/hooks/useCustomTheme"
import dayjs from "dayjs"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import React from "react"
import { View } from "react-native"
import { Calendar } from "react-native-calendars"
import { Text } from "react-native-paper"
import { getDisabledDates } from "../utils/calendar-disabled"
dayjs.extend(isSameOrBefore)

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
  return (
    <View
      style={{
        marginTop: 8,
        borderRadius: 16,
        padding: 12,
        shadowColor: theme.colors.shadow,
        shadowOpacity: 0.12,
        shadowRadius: 12,
      }}
    >
      <Text style={{ color: theme.colors.onBackground, marginBottom: 8, fontWeight: "bold", fontSize: 18 }}>
        Select Date Range
      </Text>
      <Calendar
        markingType={"custom"}
        minDate={dayjs().toISOString()}
        hideExtraDays={true}
        firstDay={1}
        markedDates={(() => {
          let dates: any = {}
          // Mark selected range
          if (customStart && !customEnd) {
            const start = dayjs(customStart).format("YYYY-MM-DD")
            dates[start] = {
              customStyles: {
                container: { backgroundColor: allDay ? theme.colors.brand.red : theme.colors.gray[700] },
                text: { color: allDay ? theme.colors.background : theme.colors.brand.red },
              },
              startingDay: true,
              endingDay: true,
            }
          } else if (customStart && customEnd) {
            const start = dayjs(customStart).startOf("day")
            const end = dayjs(customEnd).startOf("day")
            let current = start
            while (current.isSameOrBefore(end, "day")) {
              const key = current.format("YYYY-MM-DD")
              dates[key] = {
                customStyles: {
                  container: { backgroundColor: theme.colors.brand.red },
                  text: { color: theme.colors.background },
                },
                startingDay: key === start.format("YYYY-MM-DD"),
                endingDay: key === end.format("YYYY-MM-DD"),
              }
              current = current.add(1, "day")
            }
          }
          // Example: disabled days (add your logic here)
          const disabledDates: (string | Date)[] = [] // e.g. ["2025-10-28", "2025-10-29"]
          Object.assign(dates, getDisabledDates({ disabledDates }))
          return dates
        })()}
        onDayPress={(day) => {
          const selectedDate = new Date(day.dateString)
          if (allDay) {
            onStartChange(selectedDate)
            onEndChange(null)
            return
          }
          if (!customStart || (customStart && customEnd)) {
            onStartChange(selectedDate)
            onEndChange(null)
          } else if (customStart && !customEnd) {
            if (selectedDate >= customStart) {
              onEndChange(selectedDate)
            } else {
              onStartChange(selectedDate)
              onEndChange(null)
            }
          }
        }}
        theme={{
          calendarBackground: "transparent",
          dayTextColor: theme.dark ? theme.colors.onSecondary : theme.colors.onBackground,
          monthTextColor: theme.colors.brand.red,
          selectedDayBackgroundColor: theme.colors.brand.red,
          selectedDayTextColor: theme.colors.background,
          textDisabledColor: theme.colors.gray[700],
          todayTextColor: theme.colors.brand.red,
          arrowColor: theme.colors.brand.red,
          todayBackgroundColor: theme.colors.background,
          textDayFontSize: 16,
          textMonthFontSize: 20,
          todayButtonFontWeight: "bold",
          textMonthFontWeight: "bold",
          textDayHeaderFontSize: 15,
          textDayHeaderFontWeight: "bold",
        }}
        style={{
          borderRadius: 16,
          backgroundColor: "transparent",
          // Remove border/shadow for seamless card look
          borderWidth: 0,
          shadowOpacity: 0,
        }}
      />
      {(customStart || customEnd) && (
        <Text style={{ marginTop: 12, color: theme.colors.brand.red, fontWeight: "600", fontSize: 16 }}>
          {customStart ? dayjs(customStart).format("DD MMM YYYY") : ""}
          {customEnd ? ` - ${dayjs(customEnd).format("DD MMM YYYY")}` : ""}
        </Text>
      )}
    </View>
  )
}

export default CustomDateRangeCalendar
