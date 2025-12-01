import { Box, HStack, Input, Text, VStack } from "@chakra-ui/react"

interface DateTimeStepProps {
  value: {
    date: string
    time: string
  }
  onChange: (val: { date: string; time: string }) => void
}

export default function DateTimeStep({ value, onChange }: DateTimeStepProps) {
  // Local state for time picker (optional, can be controlled from parent)
  return (
    <VStack alignItems="stretch" gap={4}>
      <Text fontWeight="bold" fontSize="lg" mb={2}>
        When is your event?
      </Text>
      <HStack gap={4}>
        <Box flex={1}>
          <Text mb={1} fontSize="sm" color="gray.500">
            Date
          </Text>
          <Input
            type="date"
            value={value.date}
            onChange={(e) => onChange({ ...value, date: e.target.value })}
            borderRadius="xl"
            bg="white"
            borderColor="gray.300"
          />
        </Box>
        <Box flex={1}>
          <Text mb={1} fontSize="sm" color="gray.500">
            Time
          </Text>
          <Input
            type="time"
            value={value.time}
            onChange={(e) => onChange({ ...value, time: e.target.value })}
            borderRadius="xl"
            bg="white"
            borderColor="gray.300"
          />
        </Box>
      </HStack>
    </VStack>
  )
}
