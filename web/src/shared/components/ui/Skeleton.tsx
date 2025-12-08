import { Box, Skeleton as ChakraSkeleton, Grid, VStack } from "@chakra-ui/react"

export function Skeleton({ height = 4, ...props }: { height?: number | string; width?: string }) {
  return <ChakraSkeleton height={height} bg="bg.muted" borderRadius="md" {...props} />
}

export function EventCardSkeleton() {
  return (
    <Box bg="bg.surface" borderRadius="xl" overflow="hidden" shadow="card">
      <Skeleton height="200px" />
      <VStack align="stretch" gap={3} p={6}>
        <Skeleton height={6} width="80%" />
        <Skeleton height={4} width="60%" />
        <Skeleton height={4} width="90%" />
        <Skeleton height={4} width="70%" />
        <Box mt={2}>
          <Skeleton height={10} />
        </Box>
      </VStack>
    </Box>
  )
}

export function EventCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </Grid>
  )
}

export function DetailPageSkeleton() {
  return (
    <VStack align="stretch" gap={6}>
      <Skeleton height="400px" />
      <Box maxW="container.lg" mx="auto" w="full" px={4}>
        <VStack align="stretch" gap={4}>
          <Skeleton height={12} width="60%" />
          <Skeleton height={6} width="40%" />
          <Skeleton height={6} width="50%" />
          <Box mt={4}>
            <Skeleton height={4} />
            <Box mt={2}>
              <Skeleton height={4} />
            </Box>
            <Box mt={2}>
              <Skeleton height={4} width="80%" />
            </Box>
          </Box>
          <Box mt={6}>
            <Skeleton height={12} />
          </Box>
        </VStack>
      </Box>
    </VStack>
  )
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <VStack align="stretch" gap={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} p={4} bg="bg.surface" borderRadius="lg" shadow="sm">
          <Box mb={2}>
            <Skeleton height={6} width="70%" />
          </Box>
          <Skeleton height={4} width="50%" />
        </Box>
      ))}
    </VStack>
  )
}
