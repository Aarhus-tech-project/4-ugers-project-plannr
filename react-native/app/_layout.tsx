import CreateAccountScreen from "@/app/create-account"
import LoginScreen from "@/app/login"
import GestureRoot from "@/components/layout/GestureRoot"
import { PreferencesProvider } from "@/context/PreferencesContext"
import { SessionProvider, useSession } from "@/hooks/useSession"
import { darkTheme, lightTheme } from "@/theme"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { Stack, useSegments } from "expo-router"
import * as React from "react"
import { ScrollView, useColorScheme } from "react-native"
import { PaperProvider } from "react-native-paper"

function AppContent() {
  const { session } = useSession()
  const segments = useSegments()
  if (!session) {
    // Show create account page if route is /create-account
    if (segments[0] === "create-account") {
      return <CreateAccountScreen />
    }
    return <LoginScreen />
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const theme = colorScheme !== "dark" ? darkTheme : lightTheme

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
      <PreferencesProvider>
        <PaperProvider theme={theme}>
          <GestureRoot>
            <BottomSheetModalProvider>
              <AppContent />
            </BottomSheetModalProvider>
          </GestureRoot>
        </PaperProvider>
      </PreferencesProvider>
    </SessionProvider>
  )
}
