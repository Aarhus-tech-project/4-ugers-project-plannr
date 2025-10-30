import { useCustomTheme } from "@/hooks/useCustomTheme"
import { DateRangeMode } from "@/interfaces/filter"
import React from "react"
import { View } from "react-native"
import { Chip } from "react-native-paper"

interface DateRangeModeSelectorProps {
  customStart: Date | null
  customEnd: Date | null
  setCustomStart: (date: Date | null) => void
  setCustomEnd: (date: Date | null) => void
  mode: DateRangeMode
  setMode: (mode: DateRangeMode) => void
}

const MODES = [
  { key: "daily", label: "Current Day" },
  { key: "weekly", label: "Current Week" },
  { key: "monthly", label: "Current Month" },
  { key: "yearly", label: "Current Year" },
  { key: "custom", label: "Custom" },
]

export const DateRangeModeSelector: React.FC<DateRangeModeSelectorProps> = ({
  setCustomStart,
  setCustomEnd,
  mode,
  setMode,
}) => {
  const theme = useCustomTheme()

  return (
    <View style={{ flexDirection: "row" }}>
      {MODES.map(({ key, label }) => {
        const isSelected = mode[key as keyof typeof mode]
        return (
          <Chip
            key={key}
            icon={() => undefined}
            selected={isSelected}
            onPress={() => {
              if (key === "custom") {
                setMode({ custom: true })
              } else {
                setMode({ [key]: true } as DateRangeMode)
                setCustomStart(null)
                setCustomEnd(null)
              }
            }}
            style={{
              margin: 4,
              backgroundColor: isSelected ? theme.colors.brand.red : theme.colors.background,
              minWidth: 80,
              justifyContent: "center",
            }}
            textStyle={{ color: isSelected ? theme.colors.background : theme.colors.onBackground }}
          >
            {label}
          </Chip>
        )
      })}
    </View>
  )
}
