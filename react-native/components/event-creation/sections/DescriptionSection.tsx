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
    <View
      style={{
        marginVertical: 12,
        backgroundColor: theme.colors.background,
        borderRadius: 16,
        padding: 20,
      }}
    >
      <Text style={{ color: theme.colors.gray[500], fontSize: 14, marginBottom: 8 }}>
        Give attendees a clear idea of what your event is about. Be creative and engaging!
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Enter event description..."
        placeholderTextColor={theme.colors.gray[400]}
        multiline
        style={{
          borderWidth: 0,
          borderRadius: 10,
          padding: 14,
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

export default DescriptionSection
