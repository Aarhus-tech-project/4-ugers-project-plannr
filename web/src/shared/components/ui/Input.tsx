import { Box, Input as ChakraInput, Text } from "@chakra-ui/react"
import { forwardRef } from "react"

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string
  error?: string
  helperText?: string
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftElement, rightElement, ...props }, ref) => {
    return (
      <Box w="full">
        {label && (
          <Text fontSize="sm" fontWeight="semibold" mb={2} color="fg.default">
            {label}
          </Text>
        )}
        <Box position="relative">
          {leftElement && (
            <Box
              position="absolute"
              left={3}
              top="50%"
              transform="translateY(-50%)"
              color="fg.muted"
              pointerEvents="none"
            >
              {leftElement}
            </Box>
          )}
          <ChakraInput
            ref={ref}
            paddingLeft={leftElement ? 10 : 4}
            paddingRight={rightElement ? 10 : 4}
            h={12}
            bg="bg.surface"
            borderColor={error ? "state.error.border" : "border.default"}
            color="fg.default"
            _placeholder={{
              color: "fg.muted",
            }}
            _hover={{
              borderColor: error ? "state.error.border" : "border.emphasized",
            }}
            _focus={{
              borderColor: error ? "state.error.border" : "brand.primary",
              boxShadow: error
                ? "0 0 0 3px var(--chakra-colors-state-error-bg)"
                : "0 0 0 3px var(--chakra-colors-brand-red-100)",
              outline: "none",
            }}
            {...props}
          />
          {rightElement && (
            <Box position="absolute" right={3} top="50%" transform="translateY(-50%)" color="fg.muted">
              {rightElement}
            </Box>
          )}
        </Box>
        {error && (
          <Text fontSize="sm" color="state.error.fg" mt={1}>
            {error}
          </Text>
        )}
        {helperText && !error && (
          <Text fontSize="sm" color="fg.muted" mt={1}>
            {helperText}
          </Text>
        )}
      </Box>
    )
  }
)

Input.displayName = "Input"
