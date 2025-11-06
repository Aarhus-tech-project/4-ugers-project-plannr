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
    <View style={{ marginVertical: 8 }}>
      {guests.map((g, idx) => (
        <View
          key={idx}
          style={{
            marginBottom: 12,
            backgroundColor: theme.colors.gray[50],
            borderRadius: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: theme.colors.gray[100],
          }}
        >
          <TextInput
            value={g.name}
            onChangeText={(v) => updateGuest(idx, "name", v)}
            placeholder="Name"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.gray[200],
              borderRadius: 8,
              padding: 8,
              marginBottom: 6,
              color: theme.colors.onBackground,
              fontSize: 15,
              backgroundColor: theme.colors.white,
            }}
          />
          <TextInput
            value={g.bio}
            onChangeText={(v) => updateGuest(idx, "bio", v)}
            placeholder="Bio (optional)"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.gray[200],
              borderRadius: 8,
              padding: 8,
              marginBottom: 6,
              color: theme.colors.onBackground,
              fontSize: 15,
              backgroundColor: theme.colors.white,
            }}
          />
          <TextInput
            value={g.avatarUrl}
            onChangeText={(v) => updateGuest(idx, "avatarUrl", v)}
            placeholder="Avatar URL (optional)"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.gray[200],
              borderRadius: 8,
              padding: 8,
              marginBottom: 6,
              color: theme.colors.onBackground,
              fontSize: 15,
              backgroundColor: theme.colors.white,
            }}
          />
          <TextInput
            value={g.social}
            onChangeText={(v) => updateGuest(idx, "social", v)}
            placeholder="Social (optional)"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.gray[200],
              borderRadius: 8,
              padding: 8,
              color: theme.colors.onBackground,
              fontSize: 15,
              backgroundColor: theme.colors.white,
            }}
          />
          <TouchableOpacity onPress={() => removeGuest(idx)}>
            <Text style={{ color: theme.colors.brand.red, marginTop: 4, fontWeight: "bold" }}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addGuest} style={{ marginTop: 6 }}>
        <Text style={{ color: theme.colors.brand.blue, fontWeight: "bold" }}>+ Add Guest</Text>
      </TouchableOpacity>
      {typeof error === "string" && error.length > 0 && (
        <Text style={{ color: theme.colors.brand.red, marginTop: 4, fontSize: 13 }}>{error}</Text>
      )}
    </View>
  )
}

export default GuestsSection
