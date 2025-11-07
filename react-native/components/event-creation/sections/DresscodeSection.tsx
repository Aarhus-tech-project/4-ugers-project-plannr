import { useCustomTheme } from "@/hooks/useCustomTheme"
import React from "react"
import { TextInput, View } from "react-native"
import { Text } from "react-native-paper"

interface DresscodeSectionProps {
  value: string
  onChange: (val: string) => void
  error?: string
}

const DresscodeSection: React.FC<DresscodeSectionProps> = ({ value, onChange, error }) => {
  const theme = useCustomTheme()
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
          Let guests know if there’s a dress code or style for your event.
        </Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Describe the dress code..."
        placeholderTextColor={theme.colors.gray[400]}
        multiline
        style={{
          borderWidth: 0,
          borderRadius: 10,
          padding: 14,
          marginBottom: 8,
          minHeight: 80,
          backgroundColor: theme.colors.secondary,
          color: theme.colors.onBackground,
          fontSize: 16,
        }}
      />
      {typeof error === "string" && error.length > 0 && (
        <Text style={{ color: theme.colors.brand.red, marginTop: 6, fontSize: 13 }}>{error}</Text>
      )}
    </View>
  )
}

export default DresscodeSection
