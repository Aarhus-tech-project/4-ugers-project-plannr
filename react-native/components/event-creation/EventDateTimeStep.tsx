import CustomDateRangeCalendar from "@/components/ui/CustomDateRangeCalendar"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { getEventDateRangeError } from "@/utils/date-range-validator"
import React, { useEffect, useState } from "react"
import { Text, View } from "react-native"

export type EventDateTimeStepValidation = {
  start?: string
  end?: string
}

type EventDateTimeStepProps = {
  customStart: Date | null
  setCustomStart: (date: Date | null) => void
  customEnd: Date | null
  setCustomEnd: (date: Date | null) => void
  onValidate?: (errors: EventDateTimeStepValidation) => void
}

export default function EventDateTimeStep({
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
  onValidate,
}: EventDateTimeStepProps) {
  const theme = useCustomTheme()
  const [touched, setTouched] = useState<{ start: boolean; end: boolean }>({ start: false, end: false })

  // Use shared validator for DRYness
  let startError: string | undefined = undefined
  let endError: string | undefined = undefined
  if (!customStart) {
    startError = "Start date/time is required"
  } else {
    const dateRange = { startAt: customStart, endAt: customEnd ?? undefined }
    const errorMsg = getEventDateRangeError(dateRange)
    if (errorMsg) {
      if (errorMsg.includes("Start")) startError = errorMsg
      if (errorMsg.includes("End")) endError = errorMsg
    }
  }

  useEffect(() => {
    if (typeof onValidate === "function") {
      onValidate({ start: startError, end: endError })
    }
  }, [customStart, customEnd])

  return (
    <View
      style={{
        width: "90%",
        backgroundColor: theme.colors.secondary,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        alignSelf: "center",
      }}
      accessibilityLabel="Event Date & Time Section"
    >
      <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18, marginBottom: 8 }}>
        Date & Time
      </Text>
      {/* You can add a mode selector here if needed, like in FilterModal */}
      <CustomDateRangeCalendar
        customStart={customStart}
        customEnd={customEnd}
        onStartChange={(date) => {
          setTouched((prev) => ({ ...prev, start: true }))
          setCustomStart(date)
        }}
        onEndChange={(date) => {
          setTouched((prev) => ({ ...prev, end: true }))
          setCustomEnd(date)
        }}
      />
      {touched.start && startError ? (
        <Text
          style={{ color: theme.colors.brand.red, fontSize: 13, marginBottom: 12 }}
          accessibilityLabel="Start date error"
        >
          {startError}
        </Text>
      ) : (
        <View style={{ height: 12, marginBottom: 12 }} />
      )}
      {touched.end && endError ? (
        <Text
          style={{ color: theme.colors.brand.red, fontSize: 13, marginBottom: 12 }}
          accessibilityLabel="End date error"
        >
          {endError}
        </Text>
      ) : (
        <View style={{ height: 12, marginBottom: 12 }} />
      )}
    </View>
  )
}
