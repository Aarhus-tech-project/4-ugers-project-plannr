import { profilesService } from "@/lib/api/services/profiles"
import { Badge } from "@/shared/components/ui/Badge"
import { Button } from "@/shared/components/ui/Button"
import { Card } from "@/shared/components/ui/Card"
import type { Event } from "@/shared/types"
import { formatDate, formatLocation } from "@/shared/utils/helpers"
import { Box, Heading, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FiCalendar, FiEdit2, FiMapPin, FiTrash2 } from "react-icons/fi"

interface EventCardProps {
  event: Event
  variant?: "minimal" | "detailed"
  size?: "sm" | "md" | "lg"
  showActions?: boolean
  isUserGoing?: boolean
  isUserInterested?: boolean
  onInterested?: () => void
  onGoing?: () => void
  onRefresh?: () => void
  onUpdate?: (
    eventId: string,
    goingEvents: string[],
    interestedEvents: string[],
    wasGoing: boolean,
    wasInterested: boolean
  ) => void
  userGoingEvents?: string[]
  userInterestedEvents?: string[]
  userProfile?: { name: string; email: string; bio?: string; phone?: string; avatarUrl?: string }
  onDelete?: (eventId: string) => void
}

export function EventCardNew({
  event,
  variant = "detailed",
  size = "md",
  showActions = true,
  isUserGoing = false,
  isUserInterested = false,
  onRefresh,
  onUpdate,
  userGoingEvents = [],
  userInterestedEvents = [],
  userProfile,
  onDelete,
}: EventCardProps) {
  const [isGoing, setIsGoing] = useState(isUserGoing)
  const [isInterested, setIsInterested] = useState(isUserInterested)
  const [imgError, setImgError] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  // Check if current user is the creator
  const isCreator = session?.profileId && event.creatorId === session.profileId

  // Update local state when props change
  useEffect(() => {
    setIsGoing(isUserGoing)
    setIsInterested(isUserInterested)
  }, [isUserGoing, isUserInterested])

  const handleGoingClick = async () => {
    if (!session?.jwt || !session?.profileId || !event.id) return

    setIsUpdating(true)
    const wasGoing = isGoing
    const newGoingState = !isGoing
    setIsGoing(newGoingState)
    // If toggling going ON, remove from interested
    let newInterestedState = isInterested
    let updatedInterestedEvents = userInterestedEvents
    if (newGoingState && isInterested) {
      setIsInterested(false)
      newInterestedState = false
      updatedInterestedEvents = userInterestedEvents.filter((id) => id !== event.id)
    }
    try {
      let profile = userProfile
      let currentGoingEvents = userGoingEvents
      if (!profile) {
        const fetchedProfile = await profilesService.getById(session.profileId, session.jwt)
        profile = {
          name: fetchedProfile.name,
          email: fetchedProfile.email,
          bio: fetchedProfile.bio,
          phone: fetchedProfile.phone,
          avatarUrl: fetchedProfile.avatarUrl,
        }
        currentGoingEvents = fetchedProfile.goingToEvents || []
      }
      let updatedGoingEvents: string[]
      if (newGoingState) {
        updatedGoingEvents = currentGoingEvents.includes(event.id)
          ? currentGoingEvents
          : [...currentGoingEvents, event.id]
      } else {
        updatedGoingEvents = currentGoingEvents.filter((id) => id !== event.id)
      }
      await profilesService.update(
        session.profileId,
        {
          ...profile,
          goingToEvents: updatedGoingEvents,
          interestedEvents: updatedInterestedEvents,
        },
        session.jwt
      )
      if (onUpdate) {
        onUpdate(event.id, updatedGoingEvents, updatedInterestedEvents, wasGoing, newInterestedState)
      } else {
        onRefresh?.()
      }
    } catch (error) {
      console.error("Failed to update going status:", error)
      setIsGoing(!newGoingState)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleInterestedClick = async () => {
    if (!session?.jwt || !session?.profileId || !event.id) return

    setIsUpdating(true)
    const wasInterested = isInterested
    const newInterestedState = !isInterested
    setIsInterested(newInterestedState)
    // If toggling interested ON, remove from going
    let newGoingState = isGoing
    let updatedGoingEvents = userGoingEvents
    if (newInterestedState && isGoing) {
      setIsGoing(false)
      newGoingState = false
      updatedGoingEvents = userGoingEvents.filter((id) => id !== event.id)
    }
    try {
      let profile = userProfile
      let currentInterestedEvents = userInterestedEvents
      if (!profile) {
        const fetchedProfile = await profilesService.getById(session.profileId, session.jwt)
        profile = {
          name: fetchedProfile.name,
          email: fetchedProfile.email,
          bio: fetchedProfile.bio,
          phone: fetchedProfile.phone,
          avatarUrl: fetchedProfile.avatarUrl,
        }
        currentInterestedEvents = fetchedProfile.interestedEvents || []
      }
      let updatedInterestedEvents: string[]
      if (newInterestedState) {
        updatedInterestedEvents = currentInterestedEvents.includes(event.id)
          ? currentInterestedEvents
          : [...currentInterestedEvents, event.id]
      } else {
        updatedInterestedEvents = currentInterestedEvents.filter((id) => id !== event.id)
      }
      await profilesService.update(
        session.profileId,
        {
          ...profile,
          goingToEvents: updatedGoingEvents,
          interestedEvents: updatedInterestedEvents,
        },
        session.jwt
      )
      if (onUpdate) {
        onUpdate(event.id, updatedGoingEvents, updatedInterestedEvents, newGoingState, wasInterested)
      } else {
        onRefresh?.()
      }
    } catch (error) {
      console.error("Failed to update interested status:", error)
      setIsInterested(!newInterestedState)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEdit = () => {
    if (event.id) {
      router.push(`/events/${event.id}/edit`)
    }
  }

  const handleDelete = () => {
    if (event.id && window.confirm("Are you sure you want to delete this event?")) {
      onDelete?.(event.id)
    }
  }

  const isSm = size === "sm"
  const isMinimal = variant === "minimal"

  const imageHeight = isSm ? "140px" : size === "lg" ? "240px" : "180px"

  // Use a nice placeholder from unsplash/picsum for events without images
  const placeholderImage = `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&q=80`
  const eventImage = imgError ? placeholderImage : event.imageUrl || placeholderImage

  return (
    <Card variant="elevated" overflow="hidden" display="flex" flexDirection="column" h="full">
      {/* Image */}
      <Link href={`/events/${event.id}`}>
        <Box position="relative" overflow="hidden" cursor="pointer">
          <Image
            src={eventImage}
            alt={event.title}
            w="full"
            h={imageHeight}
            objectFit="cover"
            transition="transform 0.3s"
            _hover={{ transform: "scale(1.05)" }}
            onError={() => setImgError(true)}
            loading="lazy"
          />
          {event.spots && (
            <Box position="absolute" top={3} right={3}>
              <Badge variant="solid" colorScheme="red">
                {event.spots} spots left
              </Badge>
            </Box>
          )}
        </Box>
      </Link>

      {/* Content */}
      <VStack flex={1} p={isSm ? 4 : 5} align="stretch" gap={isSm ? 2 : 3} justify="space-between">
        <VStack align="stretch" gap={isSm ? 2 : 3}>
          {/* Title */}
          <Link href={`/events/${event.id}`}>
            <Heading
              fontSize={isSm ? "md" : size === "lg" ? "xl" : "lg"}
              fontWeight="bold"
              color="fg.default"
              lineHeight="tight"
              _hover={{ color: "brand.primary" }}
              transition="color 0.2s"
              cursor="pointer"
            >
              {event.title}
            </Heading>
          </Link>

          {/* Tags */}
          {!isMinimal && (event.themes || event.categories) && (
            <HStack gap={1.5} flexWrap="wrap">
              {(event.themes || event.categories)?.slice(0, 3).map((theme) => (
                <Badge key={theme} variant="subtle" colorScheme="gray">
                  {theme}
                </Badge>
              ))}
            </HStack>
          )}

          {/* Description */}
          {!isMinimal && event.description && (
            <Text fontSize={isSm ? "sm" : "md"} color="fg.muted" lineHeight="normal">
              {event.description}
            </Text>
          )}

          {/* Meta Info */}
          <VStack align="stretch" gap={1.5}>
            <HStack gap={2} fontSize={isSm ? "xs" : "sm"} color="fg.muted">
              <Icon as={FiCalendar} boxSize={isSm ? 3.5 : 4} color="brand.primary" />
              <Text fontWeight="medium">{event.date || formatDate(event.dateRange?.startAt)}</Text>
            </HStack>
            {event.location && (
              <HStack gap={2} fontSize={isSm ? "xs" : "sm"} color="fg.muted">
                <Icon as={FiMapPin} boxSize={isSm ? 3.5 : 4} color="brand.primary" />
                <Text>{formatLocation(event.location)}</Text>
              </HStack>
            )}
          </VStack>
        </VStack>

        {/* Actions */}
        {showActions && !isMinimal && (
          <HStack gap={2} mt={2}>
            {isCreator ? (
              // Creator actions: Edit and Delete
              <>
                <Button size={isSm ? "sm" : "md"} variant="outline" onClick={handleEdit} flex={1} colorScheme="blue">
                  <Icon as={FiEdit2} mr={1} />
                  Edit
                </Button>
                <Button size={isSm ? "sm" : "md"} variant="ghost" onClick={handleDelete} flex={1} colorScheme="red">
                  <Icon as={FiTrash2} mr={1} />
                  Delete
                </Button>
              </>
            ) : (
              // Attendee actions: Join and Interested
              <>
                <Button
                  size={isSm ? "sm" : "md"}
                  variant={isGoing ? "primary" : "outline"}
                  onClick={handleGoingClick}
                  disabled={isUpdating || !session}
                  flex={1}
                >
                  {isGoing ? "Going" : "Join"}
                </Button>
                <Button
                  size={isSm ? "sm" : "md"}
                  variant={isInterested ? "secondary" : "ghost"}
                  onClick={handleInterestedClick}
                  disabled={isUpdating || !session}
                  flex={1}
                >
                  {isInterested ? "Interested" : "Maybe"}
                </Button>
              </>
            )}
          </HStack>
        )}
      </VStack>
    </Card>
  )
}
