import { Box, Flex, Grid, HStack, Icon, Input, Text, VStack } from "@chakra-ui/react"
import { FiCalendar } from "react-icons/fi"
import { FieldBadge } from "../FieldBadge"

interface TimelineSectionProps {
  // Section visual config
  sectionData: {
    textColor: any
    iconColor: any
    bgLight: any
    borderColor: any
  }

  // Date/time state
  startDate: string
  setStartDate: (value: string) => void
  startTime: string
  setStartTime: (value: string) => void
  endDate: string
  setEndDate: (value: string) => void
  endTime: string
  setEndTime: (value: string) => void
}

export function TimelineSection({
  sectionData,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
}: TimelineSectionProps) {
  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Flex justify="space-between" align="center" mb={2}>
          <HStack gap={2}>
            <Icon as={FiCalendar} boxSize={5} color={sectionData.iconColor} />
            <Text fontWeight="semibold" fontSize="sm" color={sectionData.textColor}>
              Start Date & Time
            </Text>
          </HStack>
          <FieldBadge type="required" isComplete={!!(startDate && startTime)} />
        </Flex>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </Grid>
      </Box>

      <Box>
        <Flex justify="space-between" align="center" mb={2}>
          <HStack gap={2}>
            <Icon as={FiCalendar} boxSize={5} color={sectionData.iconColor} />
            <Text fontWeight="semibold" fontSize="sm" color={sectionData.textColor}>
              End Date & Time
            </Text>
          </HStack>
          <FieldBadge type="required" isComplete={!!(endDate && endTime)} />
        </Flex>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </Grid>
      </Box>

      {startDate && startTime && (
        <Box p={4} bg={sectionData.bgLight} borderRadius="lg" borderWidth="1px" borderColor={sectionData.borderColor}>
          <VStack align="start" gap={2}>
            <HStack gap={2}>
              <Icon as={FiCalendar} color={sectionData.iconColor} />
              <Text fontSize="sm" fontWeight="bold" color={sectionData.textColor}>
                Event Scheduled
              </Text>
            </HStack>
            <Text fontSize="lg" fontWeight="semibold" color={sectionData.textColor}>
              {new Date(`${startDate}T${startTime}`).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              at {startTime}
            </Text>
            {endDate && endTime && (
              <Text fontSize="sm" color={sectionData.iconColor} fontWeight="medium">
                Duration:{" "}
                {Math.round(
                  (new Date(`${endDate}T${endTime}`).getTime() - new Date(`${startDate}T${startTime}`).getTime()) /
                    (1000 * 60 * 60)
                )}{" "}
                hours
              </Text>
            )}
          </VStack>
        </Box>
      )}
    </VStack>
  )
}
