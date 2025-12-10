"use client"
import { IconButton } from "@chakra-ui/react"
import { LuMoon, LuSun } from "react-icons/lu"
import { useColorMode } from "../providers/ColorModeProvider"

export function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton aria-label="Toggle color mode" onClick={toggleColorMode} variant="ghost" size="sm">
      {colorMode === "light" ? <LuMoon /> : <LuSun />}
    </IconButton>
  )
}
