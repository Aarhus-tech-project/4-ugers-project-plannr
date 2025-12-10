import { Box, Flex, HStack, Icon, Input, Spinner, Text, VStack } from "@chakra-ui/react"
import { FiMapPin } from "react-icons/fi"
import { FieldBadge } from "../FieldBadge"

interface AddressSuggestion {
  display_name: string
  address: {
    city?: string
    town?: string
    country?: string
  }
}

interface StageSectionProps {
  // Section visual config
  sectionData: {
    textColor: any
    iconColor: any
    bgLight: any
    borderColor: any
  }

  // Address autocomplete state
  addressQuery: string
  setAddressQuery: (value: string) => void
  address: string
  setAddress: (value: string) => void
  showSuggestions: boolean
  setShowSuggestions: (value: boolean) => void
  addressSuggestions: AddressSuggestion[]
  isLoadingSuggestions: boolean
  city: string
  setCity: (value: string) => void
  _country: string
  setCountry: (value: string) => void

  // Venue state
  venue: string
  setVenue: (value: string) => void
}

export function StageSection({
  sectionData,
  addressQuery,
  setAddressQuery,
  address,
  setAddress,
  showSuggestions,
  setShowSuggestions,
  addressSuggestions,
  isLoadingSuggestions,
  city,
  setCity,
  _country,
  setCountry,
  venue,
  setVenue,
}: StageSectionProps) {
  return (
    <VStack align="stretch" gap={6}>
      {/* Combined Address Search */}
      <Box>
        <Flex justify="space-between" align="start" mb={2}>
          <VStack align="start" gap={1}>
            <Text fontWeight="semibold" fontSize="sm" color={sectionData.textColor}>
              Where's your event?
            </Text>
            <Text fontSize="xs" color="fg.muted">
              Start typing an address
            </Text>
          </VStack>
          <FieldBadge type="high-impact" isComplete={!!(address?.trim() && city?.trim())} />
        </Flex>

        <Box position="relative">
          <Input
            placeholder="Search for a location..."
            value={addressQuery}
            onChange={(e) => {
              setAddressQuery(e.target.value)
              setAddress(e.target.value)
              setShowSuggestions(true)
            }}
          />

          {showSuggestions && addressSuggestions.length > 0 && (
            <Box
              position="absolute"
              top="100%"
              left={0}
              right={0}
              mt={1}
              bg="bg.surface"
              borderWidth="1px"
              borderColor="border.default"
              borderRadius="md"
              boxShadow="lg"
              maxH="200px"
              overflowY="auto"
              zIndex={10}
            >
              {addressSuggestions.map((suggestion, idx) => (
                <Box
                  key={idx}
                  p={3}
                  cursor="pointer"
                  _hover={{ bg: sectionData.bgLight }}
                  onClick={() => {
                    setAddress(suggestion.display_name)
                    setAddressQuery(suggestion.display_name)
                    setCity(suggestion.address.city || suggestion.address.town || "")
                    setCountry(suggestion.address.country || "")
                    setShowSuggestions(false)
                  }}
                >
                  <HStack gap={2}>
                    <Icon as={FiMapPin} boxSize={4} color={sectionData.iconColor} />
                    <Text fontSize="sm" color="fg.default">
                      {suggestion.display_name}
                    </Text>
                  </HStack>
                </Box>
              ))}
            </Box>
          )}

          {isLoadingSuggestions && (
            <Box position="absolute" right={3} top="50%" transform="translateY(-50%)">
              <Spinner size="sm" color={sectionData.iconColor} />
            </Box>
          )}
        </Box>

        {/* Selected location display */}
        {(address || city) && (
          <Box
            mt={2}
            p={3}
            bg={sectionData.bgLight}
            borderRadius="md"
            borderWidth="1px"
            borderColor={sectionData.borderColor}
          >
            <HStack gap={2}>
              <Icon as={FiMapPin} color={sectionData.iconColor} />
              <VStack align="start" gap={0}>
                {city && (
                  <Text fontSize="sm" fontWeight="semibold" color="fg.default">
                    {city}
                  </Text>
                )}
                {address && (
                  <Text fontSize="xs" color="fg.muted">
                    {address}
                  </Text>
                )}
              </VStack>
            </HStack>
          </Box>
        )}
      </Box>

      {/* Venue Name (Optional) */}
      <Box>
        <Flex justify="space-between" align="center" mb={2}>
          <VStack align="start" gap={1}>
            <HStack gap={2}>
              <Icon as={FiMapPin} boxSize={5} color={sectionData.iconColor} />
              <Text fontWeight="semibold" fontSize="sm" color={sectionData.textColor}>
                Venue Name
              </Text>
            </HStack>
            <Text fontSize="xs" color="fg.muted">
              Optional - adds credibility!
            </Text>
          </VStack>
          <FieldBadge type="high-impact" isComplete={!!venue?.trim()} />
        </Flex>
        <Input
          placeholder="e.g., The Grand Theater, Central Park"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />
      </Box>
    </VStack>
  )
}
