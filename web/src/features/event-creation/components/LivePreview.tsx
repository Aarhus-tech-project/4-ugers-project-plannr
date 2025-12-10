import { Card } from "@/shared/components/ui/Card"
import type { EventThemeName } from "@/shared/types"
import { Box, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { FiCalendar, FiEye, FiImage, FiMapPin } from "react-icons/fi"

interface LivePreviewProps {
  title: string
  description: string
  startDate: string
  startTime: string
  address: string
  city: string
  venue: string
  selectedThemes: EventThemeName[]
  imagePreviews: string[]
}

export function LivePreview({
  title,
  description,
  startDate,
  startTime,
  address,
  city,
  venue,
  selectedThemes,
  imagePreviews,
}: LivePreviewProps) {
  const [showPerfectExample, setShowPerfectExample] = useState(false)

  // Perfect example event data
  const perfectExample = {
    title: "Summer Music Festival 2025",
    description:
      "Join us for an unforgettable evening of live music featuring top local and international artists. Experience multiple stages, food trucks, artisan markets, and a vibrant atmosphere perfect for music lovers of all ages. Don't miss this celebration of sound and community!",
    startDate: "2025-07-15",
    startTime: "18:00",
    venue: "Harbor Park Amphitheater",
    address: "123 Waterfront Boulevard",
    city: "Copenhagen",
    themes: ["Music", "Festival", "Outdoor"] as EventThemeName[],
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
  }

  return (
    <Card p={4} bg="bg.surface" shadow="sm">
      <VStack align="stretch" gap={4}>
        <HStack justify="space-between">
          <HStack gap={2}>
            <Icon as={FiEye} boxSize={4} color="brand.primary" />
            <Text fontSize="sm" fontWeight="bold" color="fg.default">
              Live Preview
            </Text>
          </HStack>
          <HStack gap={2}>
            <Box
              as="button"
              px={2}
              py={1}
              bg={
                showPerfectExample
                  ? { base: "purple.500", _dark: "purple.600" }
                  : { base: "purple.50", _dark: "purple.900/30" }
              }
              borderRadius="md"
              borderWidth="1px"
              borderColor={
                showPerfectExample
                  ? { base: "purple.600", _dark: "purple.500" }
                  : { base: "purple.200", _dark: "purple.700" }
              }
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                bg: showPerfectExample
                  ? { base: "purple.600", _dark: "purple.700" }
                  : { base: "purple.100", _dark: "purple.800/40" },
              }}
              _active={{ transform: "scale(0.95)" }}
              onMouseDown={() => setShowPerfectExample(true)}
              onMouseUp={() => setShowPerfectExample(false)}
              onMouseLeave={() => setShowPerfectExample(false)}
              onTouchStart={() => setShowPerfectExample(true)}
              onTouchEnd={() => setShowPerfectExample(false)}
            >
              <HStack gap={1}>
                <Icon
                  as={FiEye}
                  boxSize={3}
                  color={
                    showPerfectExample
                      ? { base: "white", _dark: "purple.100" }
                      : { base: "purple.600", _dark: "purple.300" }
                  }
                />
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color={
                    showPerfectExample
                      ? { base: "white", _dark: "purple.100" }
                      : { base: "purple.600", _dark: "purple.300" }
                  }
                >
                  Example
                </Text>
              </HStack>
            </Box>
            <HStack gap={1} px={2} py={1} bg={{ base: "green.500", _dark: "green.600" }} borderRadius="md">
              <Box
                w="2"
                h="2"
                bg={{ base: "white", _dark: "green.100" }}
                borderRadius="full"
                animation="pulse 2s ease-in-out infinite"
              />
              <Text fontSize="xs" fontWeight="semibold" color={{ base: "white", _dark: "green.50" }}>
                Live
              </Text>
            </HStack>
          </HStack>
        </HStack>

        <Box h="1px" bg="border.default" />

        {/* Event Preview */}
        <Box borderRadius="lg" overflow="hidden" borderWidth="1px" borderColor="border.default">
          {(showPerfectExample ? perfectExample.imageUrl : imagePreviews.length > 0) ? (
            <Box h="200px" position="relative">
              <Image
                src={showPerfectExample ? perfectExample.imageUrl : imagePreviews[0]}
                alt="Cover"
                objectFit="cover"
                w="full"
                h="full"
              />
            </Box>
          ) : (
            <Box h="200px" bg="bg.muted" display="flex" alignItems="center" justifyContent="center">
              <VStack gap={2}>
                <Icon as={FiImage} boxSize={8} color="fg.muted" />
                <Text fontSize="xs" color="fg.muted">
                  No cover image
                </Text>
              </VStack>
            </Box>
          )}

          <Box p={4}>
            <VStack align="start" gap={3}>
              <Text fontSize="xl" fontWeight="bold" color="fg.default" lineClamp={2}>
                {showPerfectExample ? perfectExample.title : title || "Your Event Title"}
              </Text>

              {(showPerfectExample ? perfectExample.themes : selectedThemes).length > 0 && (
                <HStack gap={2} flexWrap="wrap">
                  {(showPerfectExample ? perfectExample.themes : selectedThemes).slice(0, 3).map((theme) => (
                    <Box
                      key={theme}
                      px={2}
                      py={1}
                      bg="bg.subtle"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="border.default"
                    >
                      <Text fontSize="xs" fontWeight="medium" color="fg.default">
                        {theme}
                      </Text>
                    </Box>
                  ))}
                </HStack>
              )}

              {(showPerfectExample || address || city) && (
                <HStack gap={2} w="full">
                  <Icon as={FiMapPin} boxSize={4} color="brand.primary" />
                  <Text fontSize="sm" color="fg.default" lineClamp={1}>
                    {showPerfectExample
                      ? `${perfectExample.venue}, ${perfectExample.city}`
                      : `${venue ? `${venue}, ` : ""}${city || "City"}`}
                  </Text>
                </HStack>
              )}

              {(showPerfectExample || (startDate && startTime)) && (
                <HStack gap={2} w="full">
                  <Icon as={FiCalendar} boxSize={4} color="brand.primary" />
                  <Text fontSize="sm" color="fg.default">
                    {showPerfectExample
                      ? `${new Date(`${perfectExample.startDate}T${perfectExample.startTime}`).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )} at ${perfectExample.startTime}`
                      : `${new Date(`${startDate}T${startTime}`).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })} at ${startTime}`}
                  </Text>
                </HStack>
              )}

              {(showPerfectExample ? perfectExample.description : description) && (
                <Text fontSize="sm" color="fg.muted" lineClamp={3} wordBreak="break-word" whiteSpace="normal">
                  {showPerfectExample ? perfectExample.description : description}
                </Text>
              )}
            </VStack>
          </Box>
        </Box>
      </VStack>
    </Card>
  )
}
