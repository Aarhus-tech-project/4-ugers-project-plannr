import { Box, type BoxProps } from "@chakra-ui/react"

interface CardProps extends BoxProps {
  variant?: "elevated" | "outline" | "filled"
  interactive?: boolean
}

export function Card({ variant = "elevated", interactive = false, children, ...props }: CardProps) {
  const variantStyles = {
    elevated: {
      bg: "bg.surface",
      shadow: "card",
      _hover: interactive
        ? {
            shadow: "card.hover",
            transform: "translateY(-4px)",
          }
        : undefined,
    },
    outline: {
      bg: "bg.surface",
      borderWidth: "1px",
      borderColor: "border.default",
      _hover: interactive
        ? {
            borderColor: "border.emphasized",
            shadow: "sm",
          }
        : undefined,
    },
    filled: {
      bg: "bg.subtle",
      _hover: interactive
        ? {
            bg: "bg.muted",
          }
        : undefined,
    },
  }

  return (
    <Box
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      {...variantStyles[variant]}
      {...props}
    >
      {children}
    </Box>
  )
}
