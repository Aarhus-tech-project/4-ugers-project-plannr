import { Input } from "@/shared/components/ui/Input"
import { Box, Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react"
import { FiCalendar, FiCheckCircle, FiEdit, FiTarget, FiZap } from "react-icons/fi"
import { FieldBadge } from "../FieldBadge"

interface SparkSectionProps {
  sectionData: {
    textColor: any
    iconColor: any
    bgLight: any
    borderColor: any
  }
  title: string
  setTitle: (value: string) => void
}

export function SparkSection({ sectionData, title, setTitle }: SparkSectionProps) {
  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Flex justify="space-between" align="center" mb={2}>
          <HStack gap={2}>
            <Icon as={FiEdit} boxSize={5} color={sectionData.iconColor} />
            <Text fontWeight="semibold" fontSize="sm" color={sectionData.textColor}>
              Event Title
            </Text>
          </HStack>
          <FieldBadge type="required" isComplete={!!title?.trim()} />
        </Flex>
        <Input
          placeholder="e.g., Summer Music Festival 2024"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          helperText={`${title.length}/100 characters ${
            title.length > 40 ? "- Perfect length!" : title.length > 0 ? "- Keep going!" : ""
          }`}
          maxLength={100}
        />
        <HStack mt={2} gap={2} minH="32px">
          {title.length >= 20 && title.length <= 60 && (
            <HStack
              gap={1}
              px={2}
              py={1}
              bg={sectionData.bgLight}
              borderRadius="md"
              borderWidth="1px"
              borderColor={sectionData.borderColor}
            >
              <Icon as={FiCheckCircle} boxSize={3} color={sectionData.iconColor} />
              <Text fontSize="xs" fontWeight="semibold" color={sectionData.textColor}>
                Great length
              </Text>
            </HStack>
          )}
          {/[!?]/.test(title) && (
            <HStack
              gap={1}
              px={2}
              py={1}
              bg={sectionData.bgLight}
              borderRadius="md"
              borderWidth="1px"
              borderColor={sectionData.borderColor}
            >
              <Icon as={FiZap} boxSize={3} color={sectionData.iconColor} />
              <Text fontSize="xs" fontWeight="semibold" color={{ base: "purple.700", _dark: "purple.300" }}>
                Exciting
              </Text>
            </HStack>
          )}
          {/\d{4}/.test(title) && (
            <HStack
              gap={1}
              px={2}
              py={1}
              bg={{ base: "blue.100", _dark: "blue.900/30" }}
              borderRadius="md"
              borderWidth="1px"
              borderColor={{ base: "blue.200", _dark: "blue.700" }}
            >
              <Icon as={FiCalendar} boxSize={3} color={{ base: "blue.700", _dark: "blue.300" }} />
              <Text fontSize="xs" fontWeight="semibold" color={{ base: "blue.700", _dark: "blue.300" }}>
                Includes year
              </Text>
            </HStack>
          )}
        </HStack>
      </Box>

      <Box p={4} bg={sectionData.bgLight} borderRadius="lg" borderWidth="1px" borderColor={sectionData.borderColor}>
        <HStack gap={2} mb={2}>
          <Icon as={FiTarget} color={sectionData.iconColor} />
          <Text fontSize="sm" fontWeight="semibold" color={sectionData.textColor}>
            Title Tips
          </Text>
        </HStack>
        <VStack align="start" gap={1}>
          <Text fontSize="xs" color={sectionData.textColor}>
            • Keep it clear and descriptive (20-60 characters ideal)
          </Text>
          <Text fontSize="xs" color={sectionData.textColor}>
            • Include the event type or theme
          </Text>
          <Text fontSize="xs" color={sectionData.textColor}>
            • Add year if it's an annual event
          </Text>
        </VStack>
      </Box>
    </VStack>
  )
}
