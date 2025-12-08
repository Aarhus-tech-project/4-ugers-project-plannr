"use client"
import { ColorModeProvider } from "@/shared/components/providers/ColorModeProvider"
import { Toaster } from "@/shared/components/ui/toaster"
import { theme } from "@/styles/theme"
import { ChakraProvider } from "@chakra-ui/react"
import { SessionProvider } from "next-auth/react"

/**
 * AppProviders wraps the app with all global providers: Auth, Chakra, and ColorMode.
 * Use this at the root of your app for context and theme support.
 */
/**
 * AppProviders wraps the app with all global providers: Auth, Chakra, and ColorMode.
 * Use this at the root of your app for context and theme support.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChakraProvider value={theme}>
        <ColorModeProvider>
          {children}
          <Toaster />
        </ColorModeProvider>
      </ChakraProvider>
    </SessionProvider>
  )
}
