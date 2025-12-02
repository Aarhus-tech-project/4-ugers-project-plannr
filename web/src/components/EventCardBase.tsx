import type { Event } from "@/lib/types"
import { formatDate, formatLocation } from "@/lib/utils/helpers"
import { Avatar, Box, Button, Heading, HStack, Icon, Image, Tag, Text } from "@chakra-ui/react"
import { useState } from "react"
import { FiMapPin, FiShare2, FiUsers } from "react-icons/fi"

interface BaseEventCardProps {
  event: Event
  size?: "sm" | "md" | "lg"
  onGoing?: (eventId: string) => void
  onInterested?: (eventId: string) => void
  onShare?: (eventId: string) => void
}

export function BaseEventCard({ event, size = "md", onGoing, onInterested, onShare }: BaseEventCardProps) {
  const [isGoing, setIsGoing] = useState(false)
  const [isInterested, setIsInterested] = useState(false)

  const handleGoing = () => {
    setIsGoing(!isGoing)
    onGoing?.(event.id || "")
  }

  const handleInterested = () => {
    setIsInterested(!isInterested)
    onInterested?.(event.id || "")
  }

  const handleShare = () => {
    onShare?.(event.id || "")
  }

  const isSm = size === "sm"

  return (
    <Box
      minW={isSm ? "300px" : undefined}
      maxW={isSm ? "340px" : undefined}
      bg="rgba(244,244,249,0.7)"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      backdropFilter="blur(10px)"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      minH={isSm ? "auto" : "420px"}
      boxShadow={isSm ? "0 2px 12px 0 rgba(0,0,0,0.06)" : "0 4px 32px 0 rgba(0,0,0,0.08)"}
    >
      <Image
        src={event.imageUrl}
        alt={event.title}
        w="100%"
        h={isSm ? "120px" : "180px"}
        objectFit="cover"
        borderTopRadius="xl"
      />
      <Box
        flex={1}
        p={isSm ? 3 : 5}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        bg="rgba(244,244,249,0.7)"
        backdropFilter="blur(10px)"
        borderBottomRadius="xl"
      >
        <Box mb={2}>
          <Heading size={isSm ? "sm" : "md"} color="brand.red" fontWeight="extrabold" mb={1}>
            {event.title}
          </Heading>
          {event.spots && (
            <Text color="brand.red" fontWeight="bold" fontSize={isSm ? "sm" : "lg"} mb={1}>
              {event.spots} spots left
            </Text>
          )}
          <HStack gap={isSm ? 1 : 2} mb={2}>
            {(event.categories ?? event.themes ?? []).map((cat) => (
              <Tag.Root key={cat} colorPalette="gray" size={isSm ? "sm" : "md"} variant="solid" rounded="full">
                <Tag.Label>{cat}</Tag.Label>
              </Tag.Root>
            ))}
          </HStack>
          <Text color="gray.900" fontSize={isSm ? "sm" : "md"} mb={2}>
            {event.description}
          </Text>
          <HStack gap={isSm ? 1 : 2} mb={2}>
            <Icon as={FiMapPin} color="brand.red" boxSize={isSm ? 3 : 4} />
            <Text fontSize={isSm ? "xs" : "sm"} color="gray.600" fontWeight="bold">
              {formatLocation(event.location)}
            </Text>
            <Text fontSize={isSm ? "xs" : "sm"} color="gray.400">
              •
            </Text>
            <Text fontSize={isSm ? "xs" : "sm"} color="gray.700">
              {event.date || formatDate(event.dateRange?.startAt)}
            </Text>
          </HStack>
        </Box>
        <Box
          bg="rgba(255,255,255,0.6)"
          borderRadius={isSm ? "md" : "lg"}
          p={isSm ? 2 : 3}
          mt={isSm ? 1 : 2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          {!isSm && event.organizer && (
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
          <HStack gap={isSm ? 1 : 2} flex={isSm ? 1 : undefined}>
            <Button
              size={isSm ? "xs" : "sm"}
              colorScheme={isGoing ? "brand" : "gray"}
              bg={isGoing ? "brand.red" : "gray.100"}
              color={isGoing ? "white" : "gray.700"}
              borderRadius={isSm ? "md" : "lg"}
              fontWeight="bold"
              onClick={handleGoing}
            >
              <Icon as={FiUsers} mr={1} boxSize={isSm ? 3 : 4} /> Going
            </Button>
            <Button
              size={isSm ? "xs" : "sm"}
              colorScheme={isInterested ? "brand" : "gray"}
              bg={isInterested ? "brand.red" : "gray.100"}
              color={isInterested ? "white" : "gray.700"}
              borderRadius={isSm ? "md" : "lg"}
              fontWeight="bold"
              onClick={handleInterested}
            >
              Interested
            </Button>
            <Button
              size={isSm ? "xs" : "sm"}
              colorScheme="gray"
              variant="ghost"
              borderRadius={isSm ? "md" : "lg"}
              fontWeight="bold"
              onClick={handleShare}
            >
              <Icon as={FiShare2} mr={1} boxSize={isSm ? 3 : 4} /> Share
            </Button>
          </HStack>
        </Box>
      </Box>
    </Box>
  )
}
