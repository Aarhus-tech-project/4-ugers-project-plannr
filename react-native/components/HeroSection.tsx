import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { Platform, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

export const HeroSection: React.FC = () => {
  const theme = useCustomTheme()
  const router = useRouter()
  return (
    <View
      style={{
        width: "90%",
        borderRadius: 32,
        padding: 24,
        alignItems: "center",
        marginBottom: 18,
        backgroundColor: theme.dark ? "rgba(18,18,28,0.82)" : "rgba(255,255,255,0.68)",
        overflow: "hidden",
        ...(Platform.OS === "web" ? { backdropFilter: "blur(16px)" } : {}),
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 8 }}>
        <FontAwesome6
          name="user-astronaut"
          size={64}
          color={theme.colors.brand.red}
          style={{ marginBottom: 8, textShadowColor: theme.colors.shadow, textShadowRadius: 8 }}
        />
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: theme.colors.onBackground,
            textAlign: "center",
            marginBottom: 4,
            letterSpacing: 0.2,
          }}
        >
          Plan Something Epic
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: theme.colors.onBackground,
            textAlign: "center",
            marginBottom: 12,
            maxWidth: 340,
            opacity: 0.85,
          }}
        >
          Discover, join, or create events that spark your curiosity and connect you with others.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/tabs/finder")}
          activeOpacity={0.93}
          style={{
            backgroundColor: theme.colors.brand.red,
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 32,
            flexDirection: "row",
            alignItems: "center",
            marginTop: 2,
            marginBottom: 2,
            shadowColor: theme.colors.brand.red,
            shadowOpacity: 0.13,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <FontAwesome6 name="rocket" size={18} color={theme.colors.background} style={{ marginRight: 8 }} />
          <Text style={{ color: theme.colors.background, fontWeight: "bold", fontSize: 17, letterSpacing: 0.5 }}>
            Explore Events
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
