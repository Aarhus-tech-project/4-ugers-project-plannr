import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

export const palette = {
  white: "#ffffff",
  brand: {
    white: "#f4f4f9",
    red: "#e63946",
    blue: "#4285F4",
    black: "#181717",
    success: "#3dad43ff",
    info: "#1d9bf0ff",
    warning: "#ffba08ff",
    error: "#d00000",
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

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        white: { value: palette.white },
        "brand.white": { value: palette.brand.white },
        "brand.red": { value: palette.brand.red },
        "brand.blue": { value: palette.brand.blue },
        "brand.black": { value: palette.brand.black },
        "brand.success": { value: palette.brand.success },
        "brand.info": { value: palette.brand.info },
        "brand.warning": { value: palette.brand.warning },
        "brand.error": { value: palette.brand.error },
        "gray.50": { value: palette.gray[50] },
        "gray.100": { value: palette.gray[100] },
        "gray.200": { value: palette.gray[200] },
        "gray.300": { value: palette.gray[300] },
        "gray.400": { value: palette.gray[400] },
        "gray.500": { value: palette.gray[500] },
        "gray.600": { value: palette.gray[600] },
        "gray.700": { value: palette.gray[700] },
        "gray.800": { value: palette.gray[800] },
        "gray.900": { value: palette.gray[900] },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: "{colors.brand.white}" },
        fg: { value: "{colors.gray.900}" },
        "fg.muted": { value: "{colors.gray.500}" },
        "fg.subtle": { value: "{colors.gray.400}" },
        "fg.inverted": { value: "{colors.white}" },
        "fg.error": { value: "{colors.brand.error}" },
        "fg.warning": { value: "{colors.brand.warning}" },
        "fg.success": { value: "{colors.brand.success}" },
        "fg.info": { value: "{colors.brand.info}" },
        "bg.subtle": { value: "{colors.gray.100}" },
        "bg.muted": { value: "{colors.gray.50}" },
        "bg.emphasized": { value: "{colors.gray.900}" },
        "bg.inverted": { value: "{colors.brand.black}" },
        "bg.panel": { value: "{colors.gray.100}" },
        "bg.error": { value: "{colors.brand.error}" },
        "bg.warning": { value: "{colors.brand.warning}" },
        "bg.success": { value: "{colors.brand.success}" },
        "bg.info": { value: "{colors.brand.info}" },
      },
    },
  },
})

const system = createSystem(defaultConfig, config)

export const theme = system
