import { Box, Flex, HStack, Icon, Text, Textarea, VStack } from "@chakra-ui/react"
import { FiEdit3, FiStar } from "react-icons/fi"
import { FieldBadge } from "../FieldBadge"

interface AtmosphereSectionProps {
  // Section visual config
  sectionData: {
    textColor: any
    iconColor: any
    bgLight: any
    borderColor: any
    primaryColor: any
  }

  // Theme state
  selectedThemes: any[]
  onToggleTheme: (theme: any) => void
  ThemeSelector: React.ComponentType<any>

  // Description state
  description: string
  setDescription: (value: string) => void
}

export function AtmosphereSection({
  sectionData,
  selectedThemes,
  onToggleTheme,
  ThemeSelector,
  description,
  setDescription,
}: AtmosphereSectionProps) {
  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Flex justify="space-between" align="center" mb={3}>
          <HStack gap={2}>
            <Icon as={FiStar} boxSize={5} color={sectionData.iconColor} />
            <Text fontWeight="semibold" fontSize="sm" color={sectionData.textColor}>
              Select up to 4 themes that match your event vibe
            </Text>
          </HStack>
          <FieldBadge type="high-impact" isComplete={selectedThemes.length > 0} />
        </Flex>
        <ThemeSelector
          selectedThemes={selectedThemes}
          onToggle={onToggleTheme}
          maxSelections={4}
          themeColor={sectionData.primaryColor}
          themeBorderColor={sectionData.borderColor}
          themeIconColor={sectionData.iconColor}
          themeBgLight={sectionData.bgLight}
        />
      </Box>

      <Box>
        <Flex justify="space-between" align="center" mb={3}>
          <VStack align="start" gap={1} flex={1}>
            <HStack gap={2}>
              <Icon as={FiEdit3} boxSize={5} color={sectionData.iconColor} />
              <Text fontWeight="semibold" fontSize="sm" color={sectionData.textColor}>
                Description (Tell your story!)
              </Text>
            </HStack>
            <FieldBadge type="high-impact" isComplete={!!description?.trim()} />
          </VStack>
          <HStack gap={2}>
            <HStack
              gap={1}
              px={2}
              py={1}
              bg={
                description.length >= 300
                  ? { base: "green.50", _dark: "green.900/20" }
                  : description.length >= 150
                  ? { base: "blue.50", _dark: "blue.900/20" }
                  : description.length > 0
                  ? { base: "orange.50", _dark: "orange.900/20" }
                  : { base: "gray.50", _dark: "gray.800" }
              }
              borderRadius="md"
              borderWidth="1px"
              borderColor={
                description.length >= 300
                  ? { base: "green.200", _dark: "green.700" }
                  : description.length >= 150
                  ? { base: "blue.200", _dark: "blue.700" }
                  : description.length > 0
                  ? { base: "orange.200", _dark: "orange.700" }
                  : { base: "gray.200", _dark: "gray.600" }
              }
            >
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={
                  description.length >= 300
                    ? { base: "green.700", _dark: "green.200" }
                    : description.length >= 150
                    ? { base: "blue.700", _dark: "blue.200" }
                    : description.length > 0
                    ? { base: "orange.700", _dark: "orange.200" }
                    : { base: "gray.600", _dark: "gray.400" }
                }
              >
                {description.length}/500
              </Text>
            </HStack>
          </HStack>
        </Flex>

        <Box position="relative">
          <Textarea
            placeholder="Paint a picture with your words... What makes this event unforgettable?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minH="180px"
            maxLength={500}
            bg="bg.surface"
            borderColor={sectionData.borderColor}
            color="fg.default"
            _focus={{
              borderColor: sectionData.iconColor,
            }}
            fontSize="sm"
            lineHeight="1.6"
          />
        </Box>

        {/* Live quality feedback */}
        <VStack align="stretch" gap={2} mt={3}>
          {/* Writing prompts */}
          {description.length < 100 && (
            <Box
              p={4}
              bg={sectionData.bgLight}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={sectionData.borderColor}
            >
              <HStack gap={2} mb={2}>
                <Icon as={FiEdit3} color={sectionData.iconColor} />
                <Text fontSize="sm" fontWeight="semibold" color={sectionData.textColor}>
                  Writing Prompts
                </Text>
              </HStack>
              <VStack align="start" gap={1}>
                <Text fontSize="xs" color={sectionData.textColor}>
                  • What makes this event unique?
                </Text>
                <Text fontSize="xs" color={sectionData.textColor}>
                  • Who should attend and why?
                </Text>
                <Text fontSize="xs" color={sectionData.textColor}>
                  • What will attendees experience?
                </Text>
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>
    </VStack>
  )
}
