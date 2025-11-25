import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#f4f4f9" },
          100: { value: "#e6f2ff" },
          200: { value: "#bfdeff" },
          300: { value: "#99caff" },
          400: { value: "#4285F4" },
          500: { value: "#e63946" },
          600: { value: "#d00000" },
          700: { value: "#181717" },
          800: { value: "#545454ff" },
          900: { value: "#0f0f0fff" },
          950: { value: "#001a33" },
        },
        gray: {
          50: { value: "#f9f9f9ff" },
          100: { value: "#ebebebff" },
          200: { value: "#dbdbdbff" },
          300: { value: "#c7c7c7ff" },
          400: { value: "#9f9f9fff" },
          500: { value: "#757575ff" },
          600: { value: "#545454ff" },
          700: { value: "#434343ff" },
          800: { value: "#181818ff" },
          900: { value: "#0f0f0fff" },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "{colors.brand.100}" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.200}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.500}" },
        },
        // Example custom token
        "checkbox-border": {
          value: { _light: "gray.200", _dark: "gray.800" },
        },
      },
    },
    breakpoints: {
      sm: "320px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
