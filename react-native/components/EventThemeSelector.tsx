import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import React, { useMemo } from "react"
import { ScrollView, View } from "react-native"
import { Chip, Text } from "react-native-paper"

export interface EventTheme {
  name: string
  icon: string
}

interface EventThemeSelectorProps {
  themes: EventTheme[]
  selectedThemes: string[]
  onSelect: (themes: string[]) => void
}

const EventThemeSelector: React.FC<EventThemeSelectorProps> = React.memo(({ themes, selectedThemes, onSelect }) => {
  const theme = useCustomTheme()
  // Memoize the chips to avoid unnecessary re-renders
  const chips = useMemo(
    () => [
      <Chip
        key="toggle-all"
        onPress={() => {
          if (selectedThemes.length > 0) {
            onSelect([])
          } else {
            onSelect(themes.map((t) => t.name))
          }
        }}
        style={{
          margin: 4,
          backgroundColor: selectedThemes.length > 0 ? theme.colors.brand.red : theme.colors.background,
          borderWidth: 1,
          borderColor: theme.colors.brand.red,
          minWidth: 100,
          justifyContent: "center",
        }}
        textStyle={{
          color: selectedThemes.length > 0 ? theme.colors.background : theme.colors.onBackground,
          fontWeight: "bold",
        }}
      >
        {selectedThemes.length > 0 ? "Deselect All" : "Select All"}
      </Chip>,
      ...themes.map((themeObj) => {
        const isSelected = selectedThemes.includes(themeObj.name)
        return (
          <Chip
            key={themeObj.name}
            icon={() => (
              <FontAwesome6
                name={themeObj.icon}
                size={16}
                color={isSelected ? theme.colors.background : theme.colors.brand.red}
              />
            )}
            selected={isSelected}
            onPress={() => {
              onSelect(
                isSelected ? selectedThemes.filter((t) => t !== themeObj.name) : [...selectedThemes, themeObj.name]
              )
            }}
            style={{
              margin: 4,
              backgroundColor: isSelected ? theme.colors.brand.red : theme.colors.background,
              minWidth: 80,
              justifyContent: "center",
            }}
            textStyle={{ color: isSelected ? theme.colors.background : theme.colors.onBackground }}
          >
            {themeObj.name}
          </Chip>
        )
      }),
    ],
    [themes, selectedThemes, onSelect, theme.colors]
  )

  return (
    <View style={{ width: "100%" }}>
      <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18, marginBottom: 8 }}>
        Event Themes
      </Text>
      <View style={{ marginBottom: 8 }} />
      <View style={{ maxHeight: 180 }}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" }}
        >
          {chips}
        </ScrollView>
      </View>
    </View>
  )
})

export default EventThemeSelector
