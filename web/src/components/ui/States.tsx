import { Box, Spinner, Text, VStack } from "@chakra-ui/react"

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <VStack minH="200px" justify="center" align="center" py={12}>
      <Spinner size="xl" color="brand.red" borderWidth="4px" />
      <Text color="gray.600" fontSize="lg">
        {message}
      </Text>
    </VStack>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Box p={4} bg="red.50" border="1px solid" borderColor="red.200" borderRadius="lg" color="red.800">
      <Text fontWeight="bold">{message}</Text>
      {onRetry && (
        <Text mt={2} color="red.600" textDecoration="underline" cursor="pointer" onClick={onRetry}>
          Try again
        </Text>
      )}
    </Box>
  )
}

interface EmptyStateProps {
  message: string
  icon?: React.ReactNode
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <VStack minH="200px" justify="center" align="center" py={12} gap={4}>
      {icon}
      <Text color="gray.600" fontSize="lg" textAlign="center">
        {message}
      </Text>
    </VStack>
  )
}
