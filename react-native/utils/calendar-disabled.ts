// Utility to mark disabled days for react-native-calendars
// Usage: getDisabledDates({ minDate, maxDate, disabledDates })

import dayjs from "dayjs"

export function getDisabledDates({
  minDate,
  maxDate,
  disabledDates = [],
}: {
  minDate?: string | Date
  maxDate?: string | Date
  disabledDates?: Array<string | Date>
}) {
  type Mark = {
    disabled: boolean
    disableTouchEvent?: boolean
    customStyles?: {
      container: object
      text: object
    }
  }
  const marks: Record<string, Mark> = {}
  if (minDate && maxDate) {
    let current = dayjs(minDate)
    const end = dayjs(maxDate)
    while (current.isSameOrBefore(end, "day")) {
      const key = current.format("YYYY-MM-DD")
      marks[key] = { disabled: false }
      current = current.add(1, "day")
    }
  }
  disabledDates.forEach((date) => {
    const key = dayjs(date).format("YYYY-MM-DD")
    marks[key] = {
      disabled: true,
      disableTouchEvent: true,
      customStyles: {
        container: { backgroundColor: "#eee" },
        text: { color: "#bbb" },
      },
    }
  })
  return marks
}
