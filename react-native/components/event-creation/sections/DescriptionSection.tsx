import { useCustomTheme } from "@/hooks/useCustomTheme"
import { TextInput, View } from "react-native"
import { Text } from "react-native-paper"

interface DescriptionSectionProps {
  value: string
  onChange: (val: string) => void
  error?: string
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ value, onChange, error }) => {
  const theme = useCustomTheme()
  return (
    <View style={{ marginVertical: 8 }}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Enter event description..."
        placeholderTextColor={theme.colors.gray[400]}
        multiline
        style={{
          borderWidth: 1,
          borderColor: theme.colors.gray[200],
          borderRadius: 10,
          padding: 12,
          minHeight: 60,
          backgroundColor: theme.colors.gray[50],
          color: theme.colors.onBackground,
          fontSize: 15,
        }}
      />
      {typeof error === "string" && error.length > 0 && (
        <Text style={{ color: theme.colors.brand.red, marginTop: 4, fontSize: 13 }}>{error}</Text>
      )}
    </View>
  )
}

export default DescriptionSection
