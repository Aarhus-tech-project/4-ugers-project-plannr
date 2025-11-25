"use client"
import { Button } from "@chakra-ui/react"
import { useTheme } from "next-themes"

export function ColorModeButton() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      position="fixed"
      top={4}
      right={4}
      zIndex={1000}
      variant="outline"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </Button>
  )
}