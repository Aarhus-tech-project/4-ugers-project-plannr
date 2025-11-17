import { useCustomTheme } from "@/hooks/useCustomTheme"
import { EventTheme, EventThemeName } from "@/interfaces/event"
import React, { useState } from "react"
import { Text, TextInput, TouchableWithoutFeedback, View } from "react-native"
import EventThemeSelector from "../event/EventThemeSelector"

export type EventDetailsStepValidation = {
  title?: string
  themes?: string
}

type EventDetailsStepProps = {
  value: {
    title: string
    themes: EventThemeName[]
    format: "inperson" | "online" | "hybrid"
  }
  onChange: (val: { title: string; themes: EventThemeName[]; format: "inperson" | "online" | "hybrid" }) => void
  allThemes?: EventTheme[]
  onValidate?: (errors: EventDetailsStepValidation) => void
}

export default function EventDetailsStep({ value, onChange, allThemes = [], onValidate }: EventDetailsStepProps) {
  // Add context for extra fields
  const { access, setAccess, ageRestriction, setAgeRestriction } =
    require("@/context/EventCreationContext").useEventCreation()
  const theme = useCustomTheme()
  const darkMode = theme.dark
  const selectedThemes = allThemes.filter((t) => value.themes.includes(t.name))

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
      accessibilityLabel="Event Details Section"
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
        accessibilityLabel="Event Title Input"
      />
      {touched.title && titleError ? (
        <Text
          style={{ color: theme.colors.brand.red, fontSize: 13, marginBottom: 12 }}
          accessibilityLabel="Title error"
        >
          {titleError}
        </Text>
      ) : (
        <View style={{ height: 12, marginBottom: 12 }} />
      )}

      {/* Age Restriction */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18 }}>Age Restriction</Text>
        <TextInput
          value={ageRestriction !== null ? String(ageRestriction) : ""}
          onChangeText={(t) => setAgeRestriction(t ? Number(t) : null)}
          placeholder="Minimum age (optional)"
          keyboardType="numeric"
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
        />
      </View>

      {/* Access */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18 }}>Access Instructions</Text>
        <TextInput
          value={access?.instruction ?? ""}
          onChangeText={(t) => setAccess({ ...access, instruction: t })}
          placeholder="Instructions (e.g. 'Check in at reception')"
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
        />
        <TextInput
          value={access?.password ?? ""}
          onChangeText={(t) => setAccess({ ...access, password: t })}
          placeholder="Code (optional)"
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
        />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18 }}>Themes</Text>
      </View>
      <TouchableWithoutFeedback
        onPressOut={() => setTouched((prev) => ({ ...prev, themes: true }))}
        accessible={false}
        accessibilityLabel="Theme Selector"
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
      </TouchableWithoutFeedback>
      {touched.themes && themesError ? (
        <Text
          style={{ color: theme.colors.brand.red, fontSize: 13, marginBottom: 8 }}
          accessibilityLabel="Themes error"
        >
          {themesError}
        </Text>
      ) : (
        <View style={{ height: 8 }} />
      )}
    </View>
  )
}
