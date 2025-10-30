import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

export const DiscoveryPrompt: React.FC = () => {
  const theme = useCustomTheme()
  const router = useRouter()
  return (
    <View style={{ marginTop: 8, marginBottom: 2, alignItems: "center" }}>
      <Text style={{ color: theme.colors.brand.red, fontWeight: "bold", fontSize: 15, marginBottom: 2 }}>
        Not sure where to start?
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/tabs/finder")}
        style={{
          backgroundColor: theme.colors.brand.red,
          borderRadius: 18,
          paddingVertical: 8,
          paddingHorizontal: 22,
          flexDirection: "row",
          alignItems: "center",
        }}
        activeOpacity={0.9}
      >
        <FontAwesome6 name="wand-magic-sparkles" size={16} color={theme.colors.background} style={{ marginRight: 7 }} />
        <Text style={{ color: theme.colors.background, fontWeight: "bold", fontSize: 15 }}>Surprise Me</Text>
      </TouchableOpacity>
    </View>
  )
}
