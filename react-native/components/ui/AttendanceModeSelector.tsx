import { useCustomTheme } from "@/hooks/useCustomTheme"
import { EventFormat } from "@/interfaces/event"
import React from "react"
import { View } from "react-native"
import { Chip, Text } from "react-native-paper"

interface AttendanceModeSelectorProps {
  formats: EventFormat[]
  onChange: (type: EventFormat[]) => void
}

const modes = [
  { label: "In-person", value: "inperson" },
  { label: "Online", value: "online" },
  { label: "Hybrid", value: "hybrid" },
]

const AttendanceModeSelector: React.FC<AttendanceModeSelectorProps> = ({ formats, onChange }) => {
  const theme = useCustomTheme()
  return (
    <View style={{ width: "100%" }}>
      <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18, marginBottom: 8 }}>
        Attendance Mode
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {modes.map((mode) => {
          const isSelected = formats.includes(mode.value as EventFormat)
          return (
            <Chip
              key={mode.value}
              icon={() => undefined}
              selected={isSelected}
              onPress={() => {
                const value = mode.value as EventFormat
                if (formats.includes(value)) {
                  onChange(formats.filter((f) => f !== value))
                } else {
                  onChange([...formats, value])
                }
              }}
              style={{
                margin: 4,
                minWidth: 80,
                borderWidth: 0,
                justifyContent: "center",
                backgroundColor: isSelected ? theme.colors.brand.red : theme.colors.background,
                borderRadius: 10,
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
