import { useCustomTheme } from "@/hooks/useCustomTheme"
import { EventFormat } from "@/interfaces/event"
import React from "react"
import { View } from "react-native"
import { Chip, Text } from "react-native-paper"

interface AttendanceModeSelectorProps {
  eventType: EventFormat
  onChange: (type: EventFormat) => void
}

const modes = [
  { label: "In-person", value: "inperson" },
  { label: "Online", value: "online" },
  { label: "Hybrid", value: "hybrid" },
]

const AttendanceModeSelector: React.FC<AttendanceModeSelectorProps> = ({ eventType, onChange }) => {
  const theme = useCustomTheme()
  return (
    <View style={{ width: "100%" }}>
      <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18, marginBottom: 8 }}>
        Attendance Mode
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {modes.map((mode) => {
          const isSelected = eventType === mode.value
          return (
            <Chip
              key={mode.value}
              icon={() => undefined}
              selected={isSelected}
              onPress={() => onChange(mode.value as EventFormat)}
              style={{
                margin: 4,
                backgroundColor: isSelected ? theme.colors.brand.red : theme.colors.background,
              }}
              textStyle={{ color: isSelected ? theme.colors.background : theme.colors.onBackground }}
            >
              {mode.label}
            </Chip>
          )
        })}
      </View>
    </View>
  )
}

export default AttendanceModeSelector
