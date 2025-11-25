"use client"
import { Button } from "@chakra-ui/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ColorModeButton() {
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Button
      position="fixed"
      top={4}
      right={4}
      zIndex={1000}
      variant="outline"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {isMounted ? (theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode") : null}
    </Button>
  )
}
