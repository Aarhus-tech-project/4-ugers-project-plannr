import { useCustomTheme } from "@/hooks/useCustomTheme"
import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

interface Guest {
  name: string
  bio?: string
  avatarUrl?: string
  social?: string
}

interface GuestsSectionProps {
  guests: Guest[]
  onChange: (guests: Guest[]) => void
  error?: string
}

const GuestsSection: React.FC<GuestsSectionProps> = ({ guests, onChange, error }) => {
  const theme = useCustomTheme()
  const addGuest = () => onChange([...guests, { name: "" }])
  const updateGuest = (idx: number, key: keyof Guest, value: string) => {
    const updated = guests.map((g, i) => (i === idx ? { ...g, [key]: value } : g))
    onChange(updated)
  }
  const removeGuest = (idx: number) => onChange(guests.filter((_, i) => i !== idx))

  return (
    <View
      style={{
        marginVertical: 12,
        backgroundColor: theme.colors.background,
        borderRadius: 16,
        padding: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ color: theme.colors.gray[500], fontSize: 14 }}>
          Add special guests, speakers, or hosts for your event.
        </Text>
      </View>
      {guests.map((g, idx) => (
        <View
          key={idx}
          style={{
            marginBottom: 12,
            backgroundColor: theme.colors.background,
            borderRadius: 10,
          }}
        >
          <TextInput
            value={g.name}
            onChangeText={(v) => updateGuest(idx, "name", v)}
            placeholder="Name"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 0,
              borderRadius: 10,
              padding: 14,
              marginBottom: 8,
              backgroundColor: theme.colors.secondary,
              color: theme.colors.onBackground,
              fontSize: 16,
            }}
          />
          <TextInput
            value={g.bio || ""}
            onChangeText={(v) => updateGuest(idx, "bio", v)}
            placeholder="Bio (optional)"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 0,
              borderRadius: 10,
              padding: 14,
              marginBottom: 8,
              backgroundColor: theme.colors.secondary,
              color: theme.colors.onBackground,
              fontSize: 16,
            }}
          />
          <TextInput
            value={g.avatarUrl || ""}
            onChangeText={(v) => updateGuest(idx, "avatarUrl", v)}
            placeholder="Avatar URL (optional)"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 0,
              borderRadius: 10,
              padding: 14,
              marginBottom: 8,
              backgroundColor: theme.colors.secondary,
              color: theme.colors.onBackground,
              fontSize: 16,
            }}
          />
          <TextInput
            value={g.social || ""}
            onChangeText={(v) => updateGuest(idx, "social", v)}
            placeholder="Social Link (optional)"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 0,
              borderRadius: 10,
              padding: 14,
              backgroundColor: theme.colors.secondary,
              color: theme.colors.onBackground,
              fontSize: 16,
            }}
          />
          <TouchableOpacity onPress={() => removeGuest(idx)} style={{ marginTop: 4 }}>
            <Text style={{ color: theme.colors.brand.red, fontSize: 13 }}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addGuest} style={{ marginTop: 8 }}>
        <Text style={{ color: theme.colors.brand.blue, fontSize: 15, fontWeight: "bold" }}>Add Guest</Text>
      </TouchableOpacity>
      {typeof error === "string" && error.length > 0 && (
        <Text style={{ color: theme.colors.brand.red, marginTop: 6, fontSize: 13 }}>{error}</Text>
      )}
    </View>
  )
}

export default GuestsSection
