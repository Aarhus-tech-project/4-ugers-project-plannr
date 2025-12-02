import { Box, Button, Heading, HStack, Icon, Image, Tag, Text } from "@chakra-ui/react"
import { useState } from "react"
import { FiMapPin, FiShare2, FiUsers } from "react-icons/fi"

export function FeaturedEventCard({ event, onDetails }: { event: any; onDetails: () => void }) {
  const [going, setGoing] = useState(false)
  const [interested, setInterested] = useState(false)
  return (
    <Box
      minW="300px"
      maxW="340px"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      boxShadow="0 2px 12px 0 rgba(0,0,0,0.06)"
      bg="transparent"
    >
      <Box position="relative" w="100%" h="120px" bg="gray.100">
        <Image src={event.imageUrl} alt={event.title} w="100%" h="100%" objectFit="cover" borderTopRadius="xl" />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h="24px"
          bg="linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(244,244,249,0.7) 100%)"
          borderBottomRadius="xl"
        />
      </Box>
      <Box
        flex={1}
        p={3}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        bg="rgba(244,244,249,0.7)"
        backdropFilter="blur(8px)"
        borderBottomRadius="xl"
      >
        <Box mb={1}>
          <Heading size="sm" color="brand.red" fontWeight="extrabold" mb={1}>
            {event.title}
          </Heading>
          {event.spots && (
            <Text color="brand.red" fontWeight="bold" fontSize="sm" mb={1}>
              {event.spots} spots left
            </Text>
          )}
          <HStack gap={1} mb={1}>
            {(event.categories ?? []).map((cat: string) => (
              <Tag.Root key={cat} colorPalette="gray" size="sm" variant="solid" rounded="full">
                <Tag.Label>{cat}</Tag.Label>
              </Tag.Root>
            ))}
          </HStack>
          <Text color="gray.900" fontSize="sm" mb={1}>
            {event.description}
          </Text>
          <HStack gap={1} mb={1}>
            <Icon as={FiMapPin} color="brand.red" boxSize={3} />
            <Text fontSize="xs" color="gray.600" fontWeight="bold">
              {typeof event.location === "object" && event.location !== null
                ? [event.location.venue, event.location.address, event.location.city, event.location.country]
                    .filter(Boolean)
                    .join(", ")
                : event.location}
            </Text>
            <Text fontSize="xs" color="gray.400">
              •
            </Text>
            <Text fontSize="xs" color="gray.700">
              {event.date}
            </Text>
          </HStack>
        </Box>
        <Box
          bg="rgba(255,255,255,0.6)"
          borderRadius="md"
          p={2}
          mt={1}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack gap={1}>
            <Button
              size="xs"
              colorScheme={going ? "brand" : "gray"}
              bg={going ? "brand.red" : "gray.100"}
              color={going ? "white" : "gray.700"}
              borderRadius="md"
              fontWeight="bold"
              onClick={() => setGoing((g) => !g)}
            >
              <Icon as={FiUsers} mr={1} boxSize={3} /> Going
            </Button>
            <Button
              size="xs"
              colorScheme={interested ? "brand" : "gray"}
              bg={interested ? "brand.red" : "gray.100"}
              color={interested ? "white" : "gray.700"}
              borderRadius="md"
              fontWeight="bold"
              onClick={() => setInterested((i) => !i)}
            >
              Interested
            </Button>
            <Button size="xs" colorScheme="gray" variant="ghost" borderRadius="md" fontWeight="bold">
              <Icon as={FiShare2} mr={1} boxSize={3} /> Share
            </Button>
          </HStack>
        </Box>
      </Box>
    </Box>
  )
}
