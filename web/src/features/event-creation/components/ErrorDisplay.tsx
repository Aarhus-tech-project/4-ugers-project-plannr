import { Card } from "@/shared/components/ui/Card"
import { Box, Text } from "@chakra-ui/react"

interface ErrorDisplayProps {
  error: string
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <Box
      position="fixed"
      bottom={8}
      left="50%"
      transform="translateX(-50%)"
      zIndex={9999}
      maxW="md"
      animation="slideDown 0.3s ease-out"
    >
      <Card p={4} bg="state.error.bg" borderWidth="1px" borderColor="state.error.border">
        <Text color="state.error.fg" fontWeight="medium">
          {error}
        </Text>
      </Card>
    </Box>
  )
}
