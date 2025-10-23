import { MD3DarkTheme, MD3LightTheme } from "react-native-paper"

export const palette = {
  red: "#e63946", // Vibrant red
  white: "#ffffff", // Pure white
  offWhite: "#f4f4f9", // Soft off-white
  teal: "#a8dadc", // Soft teal
  blue: "#457b9d", // Muted blue
  navy: "#1d3557", // Deep navy
  darkGray: "#131316", // Medium gray
  gray: "#1c1c21", // Dark gray
  lightGray: "#2f3037", // Light gray
  neutralGray: "#6a6b70", // Neutral gray
}

// Map MD3 typescale keys to Outfit font weights
const outfitFontMap: Record<string, string> = {
  Thin: "Outfit-Thin",
  ExtraLight: "Outfit-ExtraLight",
  Light: "Outfit-Light",
  Regular: "Outfit-Regular",
  Medium: "Outfit-Medium",
  SemiBold: "Outfit-SemiBold",
  Bold: "Outfit-Bold",
  ExtraBold: "Outfit-ExtraBold",
  Black: "Outfit-Black",
}

function withOutfitFont(theme: any) {
  const typescale = theme.fonts
  const outfitTypescale: any = {}
  for (const key in typescale) {
    // MD3 typescale keys: displayLarge, displayMedium, displaySmall, headlineLarge, headlineMedium, headlineSmall, titleLarge, titleMedium, titleSmall, bodyLarge, bodyMedium, bodySmall, labelLarge, labelMedium, labelSmall
    let fontFamily = "Outfit-Regular"
    if (typescale[key]?.fontWeight) {
      // Map fontWeight to Outfit font name if possible
      fontFamily = outfitFontMap[typescale[key].fontWeight] || "Outfit-Regular"
    }
    outfitTypescale[key] = {
      ...typescale[key],
      fontFamily,
    }
  }
  return outfitTypescale
}

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.red,
    onPrimary: palette.white,
    secondary: palette.white,
    onSecondary: palette.darkGray,
    background: palette.offWhite,
    onBackground: palette.darkGray,
    surface: palette.teal,
    onSurface: palette.darkGray,
    error: palette.red,
    onError: palette.white,
    outline: palette.blue,
    shadow: palette.neutralGray,
  },
  fonts: withOutfitFont(MD3LightTheme),
}

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: palette.red,
    onPrimary: palette.darkGray,
    secondary: palette.gray,
    onSecondary: palette.white,
    background: palette.darkGray,
    onBackground: palette.white,
    surface: palette.blue,
    onSurface: palette.white,
    error: palette.red,
    onError: palette.white,
    outline: palette.teal,
    shadow: palette.neutralGray,
  },
  fonts: withOutfitFont(MD3DarkTheme),
}
