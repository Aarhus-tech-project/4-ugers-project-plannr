import LoginScreen from "@/app/login"
import GestureRoot from "@/components/GestureRoot"
import KeyboardDismissRoot from "@/components/KeyboardDismissRoot"
import { SessionProvider, useSession } from "@/hooks/useSession"
import { darkTheme, lightTheme } from "@/theme"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { Stack } from "expo-router"
import * as React from "react"
import { ActivityIndicator, ScrollView, useColorScheme, View } from "react-native"
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

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right", // enables slide transition
      }}
    />
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === "dark" ? darkTheme : lightTheme

  // Patch ScrollView defaults to disable overscroll globally
  React.useEffect(() => {
    // iOS: bounces, Android: overScrollMode
    const SV = ScrollView as any
    if (SV.defaultProps == null) SV.defaultProps = {}
    SV.defaultProps.bounces = false
    SV.defaultProps.overScrollMode = "never"
  }, [])

  return (
    <SessionProvider>
      <PaperProvider theme={theme}>
        <GestureRoot>
          <KeyboardDismissRoot>
            <BottomSheetModalProvider>
              <AppContent />
            </BottomSheetModalProvider>
          </KeyboardDismissRoot>
        </GestureRoot>
      </PaperProvider>
    </SessionProvider>
  )
}
