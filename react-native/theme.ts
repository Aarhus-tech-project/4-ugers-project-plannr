import { MD3DarkTheme, MD3LightTheme } from "react-native-paper"

export const palette = {
  white: "#ffffff",
  brand: {
    white: "#f4f4f9",
    red: "#e63946",
    blue: "#4285F4",
    black: "#181717",
  },
  gray: {
    50: "#f9f9f9ff",
    100: "#ebebebff",
    200: "#dbdbdbff",
    300: "#c7c7c7ff",
    400: "#9f9f9fff",
    500: "#757575ff",
    600: "#545454ff",
    700: "#434343ff",
    800: "#181818ff",
    900: "#0f0f0fff",
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
    background: palette.gray[800],
    onBackground: palette.white,
    surface: palette.gray[700],
    onSurface: palette.white,
    shadow: palette.gray[700],
  },
}
