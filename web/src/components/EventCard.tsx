import { Avatar, Box, Button, Heading, HStack, Icon, Image, Tag, Text } from "@chakra-ui/react"
import { useState } from "react"
import { FiMapPin, FiShare2, FiUsers } from "react-icons/fi"

export function EventCard({ event }: { event: any }) {
  const [interested, setInterested] = useState(false)
  const [going, setGoing] = useState(false)
  return (
    <Box
      bg="rgba(244,244,249,0.7)"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      backdropFilter="blur(10px)"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      minH="420px"
      boxShadow="0 4px 32px 0 rgba(0,0,0,0.08)"
    >
      <Image src={event.imageUrl} alt={event.title} w="100%" h="180px" objectFit="cover" borderTopRadius="2xl" />
      <Box
        flex={1}
        p={5}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        bg="rgba(244,244,249,0.7)"
        backdropFilter="blur(10px)"
        borderBottomRadius="xl"
      >
        <Box mb={2}>
          <Heading size="md" color="brand.red" fontWeight="extrabold" mb={1}>
            {event.title}
          </Heading>
          {event.spots && (
            <Text color="brand.red" fontWeight="bold" fontSize="lg" mb={1}>
              {event.spots} spots left
            </Text>
          )}
          <HStack gap={2} mb={2}>
            {(event.categories ?? []).map((cat: string) => (
              <Tag.Root key={cat} colorPalette="gray" size="md" variant="solid" rounded="full">
                <Tag.Label>{cat}</Tag.Label>
              </Tag.Root>
            ))}
          </HStack>
          <Text color="gray.900" fontSize="md" mb={2}>
            {event.description}
          </Text>
          <HStack gap={2} mb={2}>
            <Icon as={FiMapPin} color="brand.red" />
            <Text fontSize="sm" color="gray.600" fontWeight="bold">
              {typeof event.location === "object" && event.location !== null
                ? [event.location.venue, event.location.address, event.location.city, event.location.country]
                    .filter(Boolean)
                    .join(", ")
                : event.location}
            </Text>
            <Text fontSize="sm" color="gray.400">
              •
            </Text>
            <Text fontSize="sm" color="gray.700">
              {event.date}
            </Text>
          </HStack>
        </Box>
        <Box
          bg="rgba(255,255,255,0.6)"
          borderRadius="lg"
          p={3}
          mt={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          {event.organizer && (
            <HStack gap={2}>
              <Avatar.Root size="sm" colorPalette="gray" shape="full">
                <Avatar.Fallback name={event.organizer.name} />
                {event.organizer.imageUrl && <Avatar.Image src={event.organizer.imageUrl} />}
              </Avatar.Root>
              <Text fontSize="sm" color="gray.700" fontWeight="bold">
                {event.organizer.name}
              </Text>
            </HStack>
          )}
          <HStack gap={2}>
            <Button
              size="sm"
              colorScheme={going ? "brand" : "gray"}
              bg={going ? "brand.red" : "gray.100"}
              color={going ? "white" : "gray.700"}
              borderRadius="lg"
              fontWeight="bold"
              onClick={() => setGoing((g: boolean) => !g)}
            >
              <Icon as={FiUsers} mr={1} /> Going
            </Button>
            <Button
              size="sm"
              colorScheme={interested ? "brand" : "gray"}
              bg={interested ? "brand.red" : "gray.100"}
              color={interested ? "white" : "gray.700"}
              borderRadius="lg"
              fontWeight="bold"
              onClick={() => setInterested((i) => !i)}
            >
              Interested
            </Button>
            <Button size="sm" colorScheme="gray" variant="ghost" borderRadius="lg" fontWeight="bold">
              <Icon as={FiShare2} mr={1} /> Share
            </Button>
          </HStack>
        </Box>
      </Box>
    </Box>
  )
}
