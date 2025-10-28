import { MD3DarkTheme, MD3LightTheme } from "react-native-paper"

export const palette = {
  white: "#ffffff",
  brand: {
    white: "#f4f4f9",
    red: "#e63946",
  },
  gray: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
  },
}

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    white: palette.white,
    brand: palette.brand,
    gray: palette.gray,
    secondary: palette.white,
    onSecondary: palette.gray[900],
    background: palette.brand.white,
    onBackground: palette.gray[900],
    surface: palette.white,
    onSurface: palette.gray[700],
    shadow: palette.gray[300],
  },
}

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    white: palette.white,
    brand: palette.brand,
    gray: palette.gray,
    secondary: palette.gray[900],
    onSecondary: palette.white,
    background: palette.gray[900],
    onBackground: palette.white,
    surface: palette.gray[700],
    onSurface: palette.white,
    shadow: palette.gray[700],
  },
}
