import { useCustomTheme } from "@/hooks/useCustomTheme"
import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

export type EventFormat = "all" | "inperson" | "online" | "hybrid"

interface FilterBarProps {
  selected: EventFormat
  onSelect: (value: EventFormat) => void
}

const FILTERS: { label: string; value: EventFormat }[] = [
  { label: "All", value: "all" },
  { label: "In Person", value: "inperson" },
  { label: "Online", value: "online" },
  { label: "Hybrid", value: "hybrid" },
]

const FilterBar: React.FC<FilterBarProps> = ({ selected, onSelect }) => {
  const theme = useCustomTheme()
  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter.value}
          onPress={() => onSelect(filter.value)}
          style={[
            styles.pill,
            {
              backgroundColor: selected === filter.value ? theme.colors.brand.red : theme.colors.gray[100],
              borderColor: selected === filter.value ? theme.colors.brand.red : theme.colors.gray[300],
            },
          ]}
          activeOpacity={0.85}
        >
          <Text
            style={{
              color: selected === filter.value ? theme.colors.white : theme.colors.onBackground,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 10,
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 2,
    marginHorizontal: 2,
    elevation: 1,
  },
})

export default FilterBar
