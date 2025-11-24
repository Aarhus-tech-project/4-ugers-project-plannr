import { useCustomTheme } from "@/hooks/useCustomTheme"
import { DateRangeMode } from "@/interfaces/filter"
import { FontAwesome6 } from "@expo/vector-icons"
import React from "react"
import { StyleSheet, View } from "react-native"
import { Chip, Text } from "react-native-paper"
const styles = StyleSheet.create({
  chip: {
    margin: 4,
    minWidth: 80,
    borderWidth: 0,
    justifyContent: "center",
    borderRadius: 10,
  },
})

interface DateRangeModeSelectorProps {
  customStart: Date | null
  customEnd: Date | null
  setCustomStart: (date: Date | null) => void
  setCustomEnd: (date: Date | null) => void
  mode: DateRangeMode
  setMode: (mode: DateRangeMode) => void
}

const MODES = [
  { key: "daily", label: "Current Day", icon: "calendar-day" },
  { key: "weekly", label: "Current Week", icon: "calendar-week" },
  { key: "monthly", label: "Current Month", icon: "calendar-alt" },
  { key: "yearly", label: "Current Year", icon: "calendar" },
  { key: "custom", label: "Custom", icon: "calendar-plus" },
]

export const DateRangeModeSelector: React.FC<DateRangeModeSelectorProps> = ({ mode, setMode }) => {
  const theme = useCustomTheme()
  return (
    <View style={{ width: "100%" }}>
      <Text style={{ color: theme.colors.gray[400], fontSize: 13, marginBottom: 8 }}>
        Choose a time span to explore events
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" }}>
        {MODES.map(({ key, label, icon }) => {
          const isSelected = Boolean(mode[key as keyof DateRangeMode])
          const modeObj: DateRangeMode = {
            daily: key === "daily",
            weekly: key === "weekly",
            monthly: key === "monthly",
            yearly: key === "yearly",
            custom: key === "custom",
          }
          return (
            <Chip
              key={key}
              icon={() =>
                icon ? (
                  <FontAwesome6
                    name={icon}
                    size={16}
                    color={isSelected ? theme.colors.background : theme.colors.brand.red}
                  />
                ) : undefined
              }
              selected={isSelected}
              onPress={() => setMode(modeObj)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? theme.colors.brand.red : theme.colors.background,
                },
              ]}
              textStyle={{ color: isSelected ? theme.colors.background : theme.colors.onBackground }}
            >
              {label}
            </Chip>
          )
        })}
      </View>
    </View>
  )
}
