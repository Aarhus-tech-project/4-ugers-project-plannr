import { useCustomTheme } from "@/hooks/useCustomTheme"
import { EventTheme, EventThemeName } from "@/interfaces/event"
import { FontAwesome6 } from "@expo/vector-icons"
import React from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { Chip, Text } from "react-native-paper"

interface EventThemeSelectorProps {
  themes: EventTheme[]
  selectedThemes: EventTheme[]
  selectAllOption?: boolean
  enabledThemes?: EventThemeName[]
  contentOnly?: boolean
  onSelect: (themes: EventTheme[]) => void
}

const EventThemeSelector: React.FC<EventThemeSelectorProps> = React.memo(
  ({ themes, selectedThemes, selectAllOption, enabledThemes, contentOnly, onSelect }) => {
    const theme = useCustomTheme()
    const darkMode = theme.dark

    // Sort all themes alphabetically by name
    const sortedThemes = [...themes].sort((a, b) => a.name.localeCompare(b.name))

    // Select All chip
    const selectAllChip = (
      <Chip
        key="toggle-all"
        icon={() => (
          <FontAwesome6
            name={selectedThemes.length > 0 ? "ban" : "check"}
            size={16}
            color={selectedThemes.length > 0 ? theme.colors.background : theme.colors.brand.red}
          />
        )}
        onPress={() => {
          if (selectedThemes.length > 0) {
            onSelect([])
          } else {
            onSelect(themes.map((t) => ({ name: t.name, icon: t.icon })))
          }
        }}
        style={[
          styles.chip,
          {
            backgroundColor: selectedThemes.length > 0 ? theme.colors.brand.red : theme.colors.background,
          },
        ]}
        textStyle={{
          color: selectedThemes.length > 0 ? theme.colors.background : theme.colors.brand.red,
          fontWeight: "bold",
        }}
      >
        {selectedThemes.length > 0 ? "Deselect All" : "Select All"}
      </Chip>
    )

    // All themes as a single grid, with selectAll chip first if enabled
    const allChips = [
      ...(selectAllOption ? [selectAllChip] : []),
      ...sortedThemes.map((themeObj) => {
        const isSelected = selectedThemes.some((t) => t.name === themeObj.name)
        const isEnabled = !enabledThemes || enabledThemes.includes(themeObj.name)
        return (
          <Chip
            key={themeObj.name}
            icon={() => (
              <FontAwesome6
                name={themeObj.icon}
                size={16}
                color={
                  isSelected
                    ? theme.colors.background
                    : isEnabled
                    ? theme.colors.brand.red
                    : darkMode
                    ? theme.colors.gray[700]
                    : theme.colors.gray[200]
                }
              />
            )}
            selected={isSelected}
            disabled={!isEnabled}
            onPress={
              isEnabled
                ? () => {
                    onSelect(
                      isSelected
                        ? selectedThemes.filter((t) => t.name !== themeObj.name)
                        : [...selectedThemes, themeObj]
                    )
                  }
                : undefined
            }
            style={[
              styles.chip,
              {
                backgroundColor: isSelected
                  ? theme.colors.brand.red
                  : isEnabled
                  ? theme.colors.background
                  : theme.colors.background,
              },
            ]}
            textStyle={{
              color: isSelected
                ? theme.colors.background
                : isEnabled
                ? theme.colors.onBackground
                : darkMode
                ? theme.colors.gray[700]
                : theme.colors.gray[200],
            }}
          >
            {themeObj.name}
          </Chip>
        )
      }),
    ]

    return (
      <View style={{ width: "100%" }}>
        {!contentOnly && (
          <>
            <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18, marginBottom: 2 }}>
              Event Themes
            </Text>
            <Text style={{ color: theme.colors.gray[400], fontSize: 14, marginBottom: 8 }}>
              Pick what inspires you!
            </Text>
          </>
        )}
        {/* All themes in a single alphabetized grid, selectAll always first */}
        <View style={{ maxHeight: contentOnly ? undefined : 200 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" }}
          >
            {allChips}
          </ScrollView>
        </View>
      </View>
    )
  }
)

const styles = StyleSheet.create({
  chip: {
    margin: 4,
    minWidth: 80,
    borderWidth: 0,
    justifyContent: "center",
    borderRadius: 10,
  },
})

export default EventThemeSelector
