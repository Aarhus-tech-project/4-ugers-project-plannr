import { Box, type BoxProps } from "@chakra-ui/react"

interface BadgeProps extends BoxProps {
  variant?: "subtle" | "solid" | "outline"
  colorScheme?: "red" | "gray" | "success" | "warning" | "info"
}

export function Badge({ variant = "subtle", colorScheme = "red", children, ...props }: BadgeProps) {
  const colorStyles = {
    red: {
      subtle: {
        bg: "bg.accent",
        color: "fg.accent",
        borderColor: "border.accent",
      },
      solid: {
        bg: "brand.primary",
        color: "fg.inverted",
        borderColor: "brand.primary",
      },
      outline: {
        bg: "transparent",
        color: "fg.accent",
        borderColor: "border.accent",
      },
    },
    gray: {
      subtle: {
        bg: "bg.subtle",
        color: "fg.muted",
        borderColor: "border.muted",
      },
      solid: {
        bg: "bg.emphasized",
        color: "fg.inverted",
        borderColor: "bg.emphasized",
      },
      outline: {
        bg: "transparent",
        color: "fg.muted",
        borderColor: "border.default",
      },
    },
    success: {
      subtle: {
        bg: "state.success.bg",
        color: "state.success.fg",
        borderColor: "state.success.border",
      },
      solid: {
        bg: "state.success.fg",
        color: "white",
        borderColor: "state.success.fg",
      },
      outline: {
        bg: "transparent",
        color: "state.success.fg",
        borderColor: "state.success.border",
      },
    },
    warning: {
      subtle: {
        bg: "state.warning.bg",
        color: "state.warning.fg",
        borderColor: "state.warning.border",
      },
      solid: {
        bg: "state.warning.fg",
        color: "white",
        borderColor: "state.warning.fg",
      },
      outline: {
        bg: "transparent",
        color: "state.warning.fg",
        borderColor: "state.warning.border",
      },
    },
    info: {
      subtle: {
        bg: "state.info.bg",
        color: "state.info.fg",
        borderColor: "state.info.border",
      },
      solid: {
        bg: "state.info.fg",
        color: "white",
        borderColor: "state.info.fg",
      },
      outline: {
        bg: "transparent",
        color: "state.info.fg",
        borderColor: "state.info.border",
      },
    },
  }

  const styles = colorStyles[colorScheme][variant]

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      px={2.5}
      py={0.5}
      borderRadius="full"
      fontSize="xs"
      fontWeight="semibold"
      borderWidth={variant === "outline" ? "1px" : "0"}
      {...styles}
      {...props}
    >
      {children}
    </Box>
  )
}
