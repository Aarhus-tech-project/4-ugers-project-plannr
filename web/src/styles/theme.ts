import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

/**
 * Brand Color Palette
 * Primary: Red (#E63946) - Action, Energy, Passion
 * Neutral: White & Grays - Clean, Professional
 */
export const palette = {
  white: {
    pure: "#FFFFFF",
    soft: "#F4F4F9",
  },
  brand: {
    red: {
      50: "#FFE5E7",
      100: "#FFCCCE",
      200: "#FF999E",
      300: "#FF666D",
      400: "#FF333D",
      500: "#E63946", // Primary brand red
      600: "#CC2F3C",
      700: "#992330",
      800: "#661824",
      900: "#330C12",
    },
  },
  gray: {
    50: "#F9F9F9",
    100: "#EBEBEB",
    200: "#DBDBDB",
    300: "#C7C7C7",
    400: "#9F9F9F",
    500: "#757575",
    600: "#545454",
    700: "#434343",
    800: "#181818",
    900: "#0F0F0F",
  },
}

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Pure white
        white: { value: palette.white.pure },

        // Brand red scale
        "brand.red.50": { value: palette.brand.red[50] },
        "brand.red.100": { value: palette.brand.red[100] },
        "brand.red.200": { value: palette.brand.red[200] },
        "brand.red.300": { value: palette.brand.red[300] },
        "brand.red.400": { value: palette.brand.red[400] },
        "brand.red.500": { value: palette.brand.red[500] },
        "brand.red.600": { value: palette.brand.red[600] },
        "brand.red.700": { value: palette.brand.red[700] },
        "brand.red.800": { value: palette.brand.red[800] },
        "brand.red.900": { value: palette.brand.red[900] },

        // Gray scale
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
      fonts: {
        heading: { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
        body: { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
      },
      fontSizes: {
        xs: { value: "0.75rem" }, // 12px - Tiny text
        sm: { value: "0.875rem" }, // 14px - Small text
        md: { value: "1rem" }, // 16px - Body text
        lg: { value: "1.125rem" }, // 18px
        xl: { value: "1.25rem" }, // 20px - H4
        "2xl": { value: "1.5rem" }, // 24px - H3
        "3xl": { value: "2.25rem" }, // 36px - H2
        "4xl": { value: "3rem" }, // 48px - H1
        "5xl": { value: "3.75rem" }, // 60px
        "6xl": { value: "4.5rem" }, // 72px
      },
      lineHeights: {
        tight: { value: "1.25" },
        snug: { value: "1.375" },
        normal: { value: "1.5" },
        relaxed: { value: "1.625" },
        loose: { value: "2" },
      },
      letterSpacings: {
        tighter: { value: "-0.05em" },
        tight: { value: "-0.025em" },
        normal: { value: "0" },
        wide: { value: "0.025em" },
        wider: { value: "0.05em" },
      },
      fontWeights: {
        normal: { value: "400" },
        medium: { value: "500" },
        semibold: { value: "600" },
        bold: { value: "700" },
        extrabold: { value: "800" },
      },
      radii: {
        none: { value: "0" },
        sm: { value: "0.375rem" }, // 6px
        md: { value: "0.5rem" }, // 8px
        lg: { value: "0.75rem" }, // 12px
        xl: { value: "1rem" }, // 16px
        "2xl": { value: "1.5rem" }, // 24px
        "3xl": { value: "2rem" }, // 32px
        full: { value: "9999px" },
      },
      spacing: {
        px: { value: "1px" },
        0: { value: "0" },
        1: { value: "0.25rem" }, // 4px
        2: { value: "0.5rem" }, // 8px
        3: { value: "0.75rem" }, // 12px
        4: { value: "1rem" }, // 16px
        5: { value: "1.25rem" }, // 20px
        6: { value: "1.5rem" }, // 24px
        8: { value: "2rem" }, // 32px
        10: { value: "2.5rem" }, // 40px
        12: { value: "3rem" }, // 48px
        16: { value: "4rem" }, // 64px
        20: { value: "5rem" }, // 80px
        24: { value: "6rem" }, // 96px
        32: { value: "8rem" }, // 128px
      },
      shadows: {
        sm: { value: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)" },
        md: { value: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" },
        lg: { value: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
        xl: { value: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
        "2xl": { value: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" },
        inner: { value: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)" },
      },
    },
    semanticTokens: {
      colors: {
        // Primary brand color
        "brand.primary": { value: "{colors.brand.red.500}" },
        "brand.primary.hover": { value: "{colors.brand.red.600}" },
        "brand.primary.active": { value: "{colors.brand.red.700}" },

        // Background colors
        "bg.canvas": {
          value: { base: palette.white.soft, _dark: "{colors.gray.900}" },
        },
        "bg.surface": {
          value: { base: "{colors.white}", _dark: "{colors.gray.800}" },
        },
        "bg.subtle": {
          value: { base: "{colors.gray.50}", _dark: "{colors.gray.700}" },
        },
        "bg.muted": {
          value: { base: "{colors.gray.100}", _dark: "{colors.gray.600}" },
        },
        "bg.emphasized": {
          value: { base: "{colors.gray.900}", _dark: "{colors.gray.100}" },
        },
        "bg.accent": {
          value: { base: "{colors.brand.red.50}", _dark: "{colors.brand.red.900}" },
        },
        "bg.accent.subtle": {
          value: { base: "{colors.brand.red.100}", _dark: "{colors.brand.red.800}" },
        },
        "bg.selected": {
          value: { base: "{colors.brand.red.50}", _dark: "{colors.brand.red.900}" },
        },

        // Text colors
        "fg.default": {
          value: { base: "{colors.gray.900}", _dark: "{colors.gray.50}" },
        },
        "fg.muted": {
          value: { base: "{colors.gray.600}", _dark: "{colors.gray.400}" },
        },
        "fg.subtle": {
          value: { base: "{colors.gray.500}", _dark: "{colors.gray.500}" },
        },
        "fg.disabled": {
          value: { base: "{colors.gray.400}", _dark: "{colors.gray.600}" },
        },
        "fg.inverted": {
          value: { base: "{colors.white}", _dark: "{colors.gray.900}" },
        },
        "fg.accent": {
          value: { base: "{colors.brand.red.600}", _dark: "{colors.brand.red.400}" },
        },

        // Border colors
        "border.default": {
          value: { base: "{colors.gray.200}", _dark: "{colors.gray.700}" },
        },
        "border.muted": {
          value: { base: "{colors.gray.100}", _dark: "{colors.gray.800}" },
        },
        "border.subtle": {
          value: { base: "{colors.gray.50}", _dark: "{colors.gray.900}" },
        },
        "border.emphasized": {
          value: { base: "{colors.gray.300}", _dark: "{colors.gray.600}" },
        },
        "border.accent": {
          value: { base: "{colors.brand.red.300}", _dark: "{colors.brand.red.700}" },
        },

        // State colors
        "state.error.bg": {
          value: { base: "#FEE2E2", _dark: "#7F1D1D" },
        },
        "state.error.fg": {
          value: { base: "#991B1B", _dark: "#FCA5A5" },
        },
        "state.error.border": {
          value: { base: "#FCA5A5", _dark: "#991B1B" },
        },
        "state.success.bg": {
          value: { base: "#D1FAE5", _dark: "#064E3B" },
        },
        "state.success.fg": {
          value: { base: "#065F46", _dark: "#6EE7B7" },
        },
        "state.success.border": {
          value: { base: "#6EE7B7", _dark: "#065F46" },
        },
        "state.warning.bg": {
          value: { base: "#FEF3C7", _dark: "#78350F" },
        },
        "state.warning.fg": {
          value: { base: "#92400E", _dark: "#FCD34D" },
        },
        "state.warning.border": {
          value: { base: "#FCD34D", _dark: "#92400E" },
        },
        "state.info.bg": {
          value: { base: "#DBEAFE", _dark: "#1E3A8A" },
        },
        "state.info.fg": {
          value: { base: "#1E40AF", _dark: "#93C5FD" },
        },
        "state.info.border": {
          value: { base: "#93C5FD", _dark: "#1E40AF" },
        },
      },
      shadows: {
        card: { value: "{shadows.md}" },
        "card.hover": { value: "{shadows.lg}" },
        overlay: { value: "{shadows.2xl}" },
      },
    },
    recipes: {
      button: {
        base: {
          fontWeight: "semibold",
          borderRadius: "lg",
          transition: "all 0.2s",
        },
        variants: {
          variant: {
            primary: {
              bg: "brand.primary",
              color: "fg.inverted",
              _hover: {
                bg: "brand.primary.hover",
                transform: "translateY(-1px)",
                shadow: "md",
              },
              _active: {
                bg: "brand.primary.active",
                transform: "translateY(0)",
              },
            },
            secondary: {
              bg: "bg.muted",
              color: "fg.default",
              _hover: {
                bg: "bg.subtle",
                transform: "translateY(-1px)",
                shadow: "sm",
              },
            },
            ghost: {
              bg: "transparent",
              color: "fg.accent",
              _hover: {
                bg: "bg.accent",
              },
            },
            outline: {
              borderWidth: "2px",
              borderColor: "border.accent",
              color: "fg.accent",
              _hover: {
                bg: "bg.accent.subtle",
              },
            },
          },
        },
      },
      card: {
        base: {
          bg: "bg.surface",
          borderRadius: "xl",
          shadow: "card",
          overflow: "hidden",
          transition: "all 0.3s",
        },
        variants: {
          variant: {
            elevated: {
              _hover: {
                shadow: "card.hover",
                transform: "translateY(-4px)",
              },
            },
            outline: {
              borderWidth: "1px",
              borderColor: "border.default",
            },
            filled: {
              bg: "bg.subtle",
            },
          },
        },
      },
      input: {
        base: {
          borderRadius: "lg",
          borderWidth: "1px",
          borderColor: "border.default",
          _focus: {
            borderColor: "border.accent",
            shadow: "0 0 0 3px {colors.brand.red.100}",
          },
        },
      },
    },
    keyframes: {
      fadeIn: {
        from: { opacity: "0" },
        to: { opacity: "1" },
      },
      scaleIn: {
        from: { transform: "scale(0.9)", opacity: "0" },
        to: { transform: "scale(1)", opacity: "1" },
      },
      slideDown: {
        from: { transform: "translateX(-50%) translateY(-100%)", opacity: "0" },
        to: { transform: "translateX(-50%) translateY(0)", opacity: "1" },
      },
      bounce: {
        "0%, 100%": { transform: "scale(1)" },
        "50%": { transform: "scale(1.1)" },
      },
      ping: {
        "75%, 100%": { transform: "scale(2)", opacity: "0" },
      },
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
      pulse: {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: "0.5" },
      },
      wiggle: {
        "0%, 100%": { transform: "rotate(-3deg)" },
        "50%": { transform: "rotate(3deg)" },
      },
      shimmer: {
        "0%": {
          transform: "translateX(0)",
          opacity: "0",
        },
        "50%": {
          opacity: "1",
        },
        "100%": {
          transform: "translateX(500%)",
          opacity: "0",
        },
      },
      shimmerProgress: {
        "0%": {
          transform: "translateX(0)",
          opacity: "0",
        },
        "50%": {
          opacity: "1",
        },
        "100%": {
          transform: "translateX(calc(100% + 100cqw))",
          opacity: "0",
        },
      },
      particle: {
        "0%": {
          transform: "translateY(0) scale(1)",
          opacity: "1",
        },
        "100%": {
          transform: "translateY(-30px) scale(0)",
          opacity: "0",
        },
      },
      sparkFly: {
        "0%": {
          transform: "translate(0, 0) scale(1) rotate(0deg)",
          opacity: "1",
        },
        "50%": {
          opacity: "1",
        },
        "100%": {
          transform: "translate(var(--spark-x), var(--spark-y)) scale(0) rotate(180deg)",
          opacity: "0",
        },
      },
      flickerGlow: {
        "0%, 100%": {
          opacity: "0.8",
          filter: "brightness(1)",
        },
        "50%": {
          opacity: "1",
          filter: "brightness(1.5)",
        },
      },
      progressPulse: {
        "0%, 100%": {
          filter: "brightness(1)",
        },
        "50%": {
          filter: "brightness(1.1)",
        },
      },
      glow: {
        "0%, 100%": {
          filter: "brightness(1) drop-shadow(0 0 0px currentColor)",
        },
        "50%": {
          filter: "brightness(1.2) drop-shadow(0 0 15px currentColor)",
        },
      },
      countdownBar: {
        "0%": {
          transform: "scaleX(1)",
        },
        "100%": {
          transform: "scaleX(0)",
        },
      },
      ripple: {
        "0%": {
          transform: "translate(-50%, -50%) scale(0.5)",
          opacity: "1",
        },
        "100%": {
          transform: "translate(-50%, -50%) scale(2.5)",
          opacity: "0",
        },
      },
      glowPulse: {
        "0%": {
          transform: "translate(-50%, -50%) scale(0.5)",
          opacity: "1",
        },
        "50%": {
          transform: "translate(-50%, -50%) scale(1.5)",
          opacity: "0.8",
        },
        "100%": {
          transform: "translate(-50%, -50%) scale(1)",
          opacity: "1",
        },
      },
    },
  },
})

const system = createSystem(defaultConfig, config)

export const theme = system
