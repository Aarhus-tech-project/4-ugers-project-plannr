import LoginScreen from "@/app/login"
import { SessionProvider, useSession } from "@/hooks/useSession"
import { darkTheme, lightTheme } from "@/theme"
import { Stack } from "expo-router"
import * as React from "react"
import { ActivityIndicator, useColorScheme, View } from "react-native"
import { PaperProvider } from "react-native-paper"

function AppContent() {
  const { session, loading } = useSession()
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  if (!session) return <LoginScreen />

  return <Stack screenOptions={{ headerShown: false }} />
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <SessionProvider>
      <PaperProvider theme={colorScheme !== "dark" ? darkTheme : lightTheme}>
        <AppContent />
      </PaperProvider>
    </SessionProvider>
  )
}
