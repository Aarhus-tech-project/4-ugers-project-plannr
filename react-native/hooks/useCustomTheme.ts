import { MD3Theme, useTheme as usePaperTheme } from "react-native-paper"
import { palette } from "../theme"

type PaletteKeys = keyof typeof palette

export type CustomTheme = MD3Theme & {
  colors: MD3Theme["colors"] & {
    [K in PaletteKeys]: (typeof palette)[K]
  }
}

export function useCustomTheme(): CustomTheme {
  return usePaperTheme() as CustomTheme
}
