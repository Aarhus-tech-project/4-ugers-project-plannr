import LogoutButton from "@/components/LogoutButton"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useRef } from "react"
import { Image, ScrollView, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"
import { useSession } from "../../hooks/useSession"

export default function Settings() {
  const router = useRouter()
  const theme = useCustomTheme()
  const { session } = useSession()
  const navigatingPreferences = useRef(false)
  const navigatingAccount = useRef(false)
  // Helper to robustly reset navigation lock after a delay
  const resetNavLock = (ref: React.RefObject<boolean>) =>
    setTimeout(() => {
      ref.current = false
    }, 1200)

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          paddingTop: 80,
          paddingBottom: 16,
          paddingLeft: 20,
          backgroundColor: theme.colors.secondary,
        }}
      >
        <Text
          style={{
            color: theme.colors.onBackground,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 32,
            left: 40,
          }}
        >
          Settings
        </Text>
      </View>
      {/* Cards */}
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 100, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,

            alignItems: "center",
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 12 }}>
            {/* Outer red border */}
            <View
              style={{
                width: 112,
                height: 112,
                borderRadius: 56,
                borderWidth: 3,
                borderColor: theme.colors.brand.red,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Transparent border */}
              <View
                style={{
                  width: 106,
                  height: 106,
                  borderRadius: 53,
                  borderWidth: 3,
                  borderColor: "rgba(0,0,0,0)",
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: session?.user?.avatarUrl || "" }}
                  style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 0 }}
                />
              </View>
            </View>
            <Text style={{ color: theme.colors.onBackground, fontWeight: "bold", fontSize: 22 }}>
              {session?.user?.name || "Daniel"}
            </Text>
            <Text style={{ color: theme.colors.onBackground, fontSize: 16 }}>{"Plannr member"}</Text>
          </View>
        </View>
        {/* Preferences Card */}
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 8,
              opacity: navigatingPreferences.current ? 0.5 : 1,
            }}
            activeOpacity={0.7}
            disabled={navigatingPreferences.current}
            onPress={async () => {
              if (navigatingPreferences.current) return
              navigatingPreferences.current = true
              try {
                await router.push("/preferences")
              } finally {
                resetNavLock(navigatingPreferences)
              }
            }}
          >
            <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18 }}>
              Finder Preferences
            </Text>
            <FontAwesome6 name={"sliders"} size={20} color={theme.colors.brand.red} />
          </TouchableOpacity>
        </View>
        {/* Account Card */}
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 8,
              opacity: navigatingAccount.current ? 0.5 : 1,
            }}
            activeOpacity={0.7}
            disabled={navigatingAccount.current}
            onPress={async () => {
              if (navigatingAccount.current) return
              navigatingAccount.current = true
              try {
                await router.push("/account")
              } finally {
                resetNavLock(navigatingAccount)
              }
            }}
          >
            <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18 }}>Account</Text>
            <FontAwesome6 name={"gear"} size={20} color={theme.colors.brand.red} />
          </TouchableOpacity>
        </View>
        {/* Logout Button */}
        <LogoutButton />
      </ScrollView>
    </>
  )
}
