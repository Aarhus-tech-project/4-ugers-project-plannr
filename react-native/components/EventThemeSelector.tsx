import { useCustomTheme } from "@/hooks/useCustomTheme"
import { EventTheme } from "@/interfaces/event"
import { FontAwesome6 } from "@expo/vector-icons"
import React, { useMemo } from "react"
import { ScrollView, View } from "react-native"
import { Chip, Text } from "react-native-paper"

interface EventThemeSelectorProps {
  themes: EventTheme[]
  selectedThemes: EventTheme[]
  onSelect: (themes: EventTheme[]) => void
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
            onSelect(themes.map((t) => ({ name: t.name, icon: t.icon })))
          }
        }}
        style={{
          margin: 4,
          backgroundColor: selectedThemes.length > 0 ? theme.colors.brand.red : theme.colors.background,
          borderWidth: 0,
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
        const isSelected = selectedThemes.some((t) => t.name === themeObj.name)
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
                isSelected ? selectedThemes.filter((t) => t.name !== themeObj.name) : [...selectedThemes, themeObj]
              )
            }}
            style={{
              margin: 4,
              backgroundColor: isSelected ? theme.colors.brand.red : theme.colors.background,
              minWidth: 80,
              borderWidth: 0,
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
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" }}
        >
          {chips}
        </ScrollView>
      </View>
    </View>
  )
})

export default EventThemeSelector
