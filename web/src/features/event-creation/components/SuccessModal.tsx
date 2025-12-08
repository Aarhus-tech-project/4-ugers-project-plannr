import { Card } from "@/shared/components/ui/Card"
import { Box, Heading, Icon, Text, VStack } from "@chakra-ui/react"
import { FiCheckCircle } from "react-icons/fi"

export function SuccessModal() {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.700"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={9999}
      animation="fadeIn 0.3s ease-in"
    >
      <Card p={8} textAlign="center" maxW="md" animation="scaleIn 0.4s ease-out">
        <VStack gap={4}>
          <Box position="relative">
            <Icon as={FiCheckCircle} boxSize={20} color="green.500" animation="bounce 0.6s ease-in-out" />
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="green.400"
              borderRadius="full"
              opacity={0.2}
              animation="ping 1s cubic-bezier(0, 0, 0.2, 1) infinite"
            />
          </Box>
          <Heading fontSize="3xl" fontWeight="bold">
            Event Created!
          </Heading>
          <Text fontSize="lg" color="fg.muted">
            Your story is live and ready to inspire!
          </Text>
          <Text fontSize="sm" color="fg.subtle">
            Redirecting to events page...
          </Text>
        </VStack>
      </Card>
    </Box>
  )
}
