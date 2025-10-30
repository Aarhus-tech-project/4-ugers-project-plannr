import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { Platform, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

export const QuickActions: React.FC = () => {
  const theme = useCustomTheme()
  const router = useRouter()
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 16, marginBottom: 8 }}>
      <TouchableOpacity
        onPress={() => router.push("/tabs/create")}
        style={{
          backgroundColor: theme.dark ? "rgba(18,18,28,0.82)" : "rgba(255,255,255,0.68)",
          borderRadius: 24,
          padding: 16,
          alignItems: "center",
          minWidth: 90,
          overflow: "hidden",
          ...(Platform.OS === "web" ? { backdropFilter: "blur(12px)" } : {}),
        }}
        activeOpacity={0.85}
      >
        <FontAwesome6 name="plus" size={22} color={theme.colors.brand.red} />
        <Text style={{ color: theme.colors.brand.red, fontWeight: "bold", marginTop: 4, fontSize: 14 }}>Create</Text>
        <Text style={{ color: theme.colors.onBackground, fontSize: 11 }}>Start something new</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/tabs/groups")}
        style={{
          backgroundColor: theme.dark ? "rgba(18,18,28,0.82)" : "rgba(255,255,255,0.68)",
          borderRadius: 24,
          padding: 16,
          alignItems: "center",
          minWidth: 90,
          overflow: "hidden",
          ...(Platform.OS === "web" ? { backdropFilter: "blur(12px)" } : {}),
        }}
        activeOpacity={0.85}
      >
        <FontAwesome6 name="users" size={22} color={theme.colors.brand.red} />
        <Text style={{ color: theme.colors.brand.red, fontWeight: "bold", marginTop: 4, fontSize: 14 }}>Groups</Text>
        <Text style={{ color: theme.colors.onBackground, fontSize: 11 }}>Meet your crew</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/account")}
        style={{
          backgroundColor: theme.colors.secondary,
          borderRadius: 24,
          padding: 16,
          alignItems: "center",
          minWidth: 90,
          overflow: "hidden",
          ...(Platform.OS === "web" ? { backdropFilter: "blur(12px)" } : {}),
        }}
        activeOpacity={0.85}
      >
        <FontAwesome6 name="user-plus" size={22} color={theme.colors.brand.red} />
        <Text style={{ color: theme.colors.brand.red, fontWeight: "bold", marginTop: 4, fontSize: 14 }}>Invite</Text>
        <Text style={{ color: theme.colors.onBackground, fontSize: 11 }}>Grow the party</Text>
      </TouchableOpacity>
    </View>
  )
}
