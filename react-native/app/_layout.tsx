import { SessionProvider, useSession } from "@/hooks/useSession"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { ActivityIndicator, useColorScheme, View } from "react-native"
import { PaperProvider } from "react-native-paper"
import { darkTheme, lightTheme } from "../theme"
import LoginScreen from "./login" // Adjust path if needed

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
  const [fontsLoaded] = useFonts({
    "Outfit-Thin": require("../assets/fonts/Outfit-Thin.ttf"),
    "Outfit-ExtraLight": require("../assets/fonts/Outfit-ExtraLight.ttf"),
    "Outfit-Light": require("../assets/fonts/Outfit-Light.ttf"),
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "Outfit-SemiBold": require("../assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "Outfit-ExtraBold": require("../assets/fonts/Outfit-ExtraBold.ttf"),
    "Outfit-Black": require("../assets/fonts/Outfit-Black.ttf"),
  })

  if (!fontsLoaded) return null // or a splash screen

  return (
    <SessionProvider>
      <PaperProvider theme={colorScheme !== "dark" ? darkTheme : lightTheme}>
        <AppContent />
      </PaperProvider>
    </SessionProvider>
  )
}
