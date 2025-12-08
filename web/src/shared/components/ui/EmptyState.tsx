import { Box, Heading, Icon, Text, VStack } from "@chakra-ui/react"
import { IconType } from "react-icons"

interface EmptyStateProps {
  icon?: IconType
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: IconComponent, title, description, action }: EmptyStateProps) {
  return (
    <VStack gap={4} py={12} px={6} textAlign="center" maxW="md" mx="auto">
      {IconComponent && (
        <Box p={4} bg="bg.subtle" borderRadius="full">
          <Icon as={IconComponent} boxSize={8} color="fg.muted" />
        </Box>
      )}
      <VStack gap={2}>
        <Heading fontSize="xl" fontWeight="semibold" color="fg.default">
          {title}
        </Heading>
        {description && (
          <Text fontSize="md" color="fg.muted" lineHeight="relaxed">
            {description}
          </Text>
        )}
      </VStack>
      {action && <Box mt={2}>{action}</Box>}
    </VStack>
  )
}
