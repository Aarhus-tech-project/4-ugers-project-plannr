import { Button as ChakraButton, type ButtonProps as ChakraButtonProps } from "@chakra-ui/react"

interface ButtonProps extends Omit<ChakraButtonProps, "variant"> {
  variant?: "primary" | "secondary" | "ghost" | "outline"
}

export function Button({ variant = "primary", children, ...props }: ButtonProps) {
  const variantStyles = {
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
      borderWidth: "1px",
      borderColor: "border.default",
      _hover: {
        bg: "bg.subtle",
        borderColor: "border.emphasized",
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
      bg: "transparent",
      _hover: {
        bg: "bg.accent.subtle",
      },
    },
  }

  return (
    <ChakraButton fontWeight="semibold" borderRadius="lg" transition="all 0.2s" {...variantStyles[variant]} {...props}>
      {children}
    </ChakraButton>
  )
}
