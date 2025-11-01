import EventThemeSelector from "@/components/EventThemeSelector"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { EventTheme, EventThemeName } from "@/interfaces/event"
import { FontAwesome6 } from "@expo/vector-icons"
import React, { useState } from "react"
import { Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"

export type EventDetailsStepValidation = {
  title?: string
  themes?: string
}

type EventDetailsStepProps = {
  value: {
    title: string
    themes: EventThemeName[]
  }
  onChange: (val: { title: string; themes: EventThemeName[] }) => void
  allThemes?: EventTheme[]
  onValidate?: (errors: EventDetailsStepValidation) => void
}

export default function EventDetailsStep({ value, onChange, allThemes = [], onValidate }: EventDetailsStepProps) {
  const theme = useCustomTheme()
  const darkMode = theme.dark
  const selectedThemes = allThemes.filter((t) => value.themes.includes(t.name))

  // Add or remove a theme
  const handleToggleTheme = (theme: EventTheme) => {
    if (value.themes.includes(theme.name)) {
      onChange({ ...value, themes: value.themes.filter((n) => n !== theme.name) })
    } else if (value.themes.length < 4) {
      onChange({ ...value, themes: [...value.themes, theme.name] })
    }
  }

  // Remove all selected themes
  const handleClearThemes = () => {
    onChange({ ...value, themes: [] })
  }

  // Validation state
  const [touched, setTouched] = useState<{ title: boolean; themes: boolean }>({ title: false, themes: false })
  const titleError = !value.title.trim() ? "Title is required" : value.title.length > 60 ? "Title is too long" : ""
  const themesError = selectedThemes.length === 0 ? "Select at least one theme" : ""

  // Expose validation to parent
  React.useEffect(() => {
    if (typeof onValidate === "function") {
      onValidate({
        title: titleError,
        themes: themesError,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.title, value.themes])

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
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18 }}>Title</Text>
      </View>
      <TextInput
        value={value.title}
        onChangeText={(t) => onChange({ ...value, title: t })}
        onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
        placeholder="Enter event title"
        placeholderTextColor={darkMode ? theme.colors.gray[400] : theme.colors.gray[600]}
        style={{
          borderRadius: 8,
          padding: 12,
          height: 48,
          fontSize: 16,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: theme.colors.background,
          marginBottom: 8,
          borderWidth: touched.title && titleError ? 1 : 0,
          borderColor: touched.title && titleError ? theme.colors.brand.red : undefined,
          color: theme.colors.onBackground,
        }}
        maxLength={60}
      />
      {touched.title && titleError ? (
        <Text style={{ color: theme.colors.brand.red, fontSize: 13, marginBottom: 12 }}>{titleError}</Text>
      ) : (
        <View style={{ height: 12, marginBottom: 12 }} />
      )}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18 }}>Themes</Text>
      </View>
      {/* Selected themes in a container with trash bubble */}
      {selectedThemes.length > 0 && (
        <View
          style={{
            position: "relative",
            marginBottom: 16,
            minHeight: 64,
            borderRadius: 12,
            padding: 10,
            alignSelf: "flex-start",
            maxWidth: "100%",
            backgroundColor: theme.colors.background,
          }}
        >
          {/* Trash icon to clear all themes */}
          <View
            style={{
              position: "absolute",
              top: -12,
              right: -12,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.secondary,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
              shadowColor: theme.colors.onBackground,
              shadowOpacity: 0.12,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <TouchableOpacity
              onPress={handleClearThemes}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="trash" size={16} color={theme.colors.brand.red} />
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", alignItems: "flex-end", minHeight: 64, paddingTop: 8, paddingRight: 24 }}
          >
            {selectedThemes
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((themeObj) => (
                <View key={themeObj.name} style={{ alignItems: "center", marginRight: 16 }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: theme.colors.brand.red,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 2,
                      position: "relative",
                    }}
                  >
                    {/* Remove icon button */}
                    <View
                      style={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: theme.colors.secondary,
                        borderColor: theme.colors.background,
                        borderWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 2,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleToggleTheme(themeObj)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        activeOpacity={0.7}
                      >
                        <FontAwesome6 name="xmark" size={12} color={theme.colors.brand.red} />
                      </TouchableOpacity>
                    </View>
                    <FontAwesome6 name={themeObj.icon} size={20} color={theme.colors.background} />
                  </View>
                  <Text
                    style={{
                      color: theme.colors.onBackground,
                      fontSize: 12,
                      marginTop: 0,
                      textAlign: "center",
                      maxWidth: 60,
                    }}
                    numberOfLines={1}
                  >
                    {themeObj.name}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      )}
      <TouchableWithoutFeedback onPressOut={() => setTouched((prev) => ({ ...prev, themes: true }))} accessible={false}>
        <View
          style={{
            borderWidth: touched.themes && themesError ? 1 : 0,
            borderColor: touched.themes && themesError ? theme.colors.brand.red : undefined,
            borderRadius: 8,
            marginBottom: 8,
            padding: 4,
          }}
        >
          <EventThemeSelector
            themes={allThemes}
            selectedThemes={selectedThemes}
            contentOnly={true}
            onSelect={(themes: EventTheme[]) => {
              // Only allow up to 4 themes
              const names = themes.map((t: EventTheme) => t.name).slice(0, 4)
              onChange({ ...value, themes: names })
              setTouched((prev) => ({ ...prev, themes: true }))
            }}
            enabledThemes={selectedThemes.length === 4 ? selectedThemes.map((t) => t.name) : undefined}
          />
        </View>
      </TouchableWithoutFeedback>
      {touched.themes && themesError ? (
        <Text style={{ color: theme.colors.brand.red, fontSize: 13, marginBottom: 8 }}>{themesError}</Text>
      ) : (
        <View style={{ height: 8 }} />
      )}
    </View>
  )
}
