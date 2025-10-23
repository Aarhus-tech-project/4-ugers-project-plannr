import { MD3DarkTheme, MD3LightTheme } from "react-native-paper"

export const palette = {
  red: "#e63946",
  white: "#ffffff",
  offWhite: "#f4f4f9",
  teal: "#a8dadc",
  blue: "#457b9d",
  navy: "#1d3557",
  darkGray: "#131316",
  gray: "#1c1c21",
  lightGray: "#2f3037",
  neutralGray: "#6a6b70",
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
}
