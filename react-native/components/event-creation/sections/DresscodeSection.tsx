import { useCustomTheme } from "@/hooks/useCustomTheme"
import React from "react"
import { TextInput, View } from "react-native"

interface DresscodeSectionProps {
  value: string
  onChange: (val: string) => void
}

const DresscodeSection: React.FC<DresscodeSectionProps> = ({ value, onChange }) => {
  const theme = useCustomTheme()
  return (
    <View style={{ marginVertical: 8 }}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Describe the dress code..."
        placeholderTextColor={theme.colors.gray[400]}
        multiline
        style={{
          borderWidth: 1,
          borderColor: theme.colors.gray[200],
          borderRadius: 10,
          padding: 12,
          minHeight: 40,
          backgroundColor: theme.colors.gray[50],
          color: theme.colors.onBackground,
          fontSize: 15,
        }}
      />
    </View>
  )
}

export default DresscodeSection
