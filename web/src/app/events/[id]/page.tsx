"use client"

import { eventsService } from "@/lib/api/services/events"
import { profilesService } from "@/lib/api/services/profiles"
import { Navigation } from "@/shared/components/layout/Navigation"
import { Button } from "@/shared/components/ui/Button"
import { Card } from "@/shared/components/ui/Card"
import type { Event } from "@/shared/types"
import { formatDate } from "@/shared/utils/helpers"
import { Badge, Box, Container, Grid, Heading, HStack, Icon, Image, Spinner, Text, VStack } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"
import {
  FiArrowLeft,
  FiCalendar,
  FiDollarSign,
  FiDownload,
  FiEdit2,
  FiFile,
  FiHeart,
  FiImage,
  FiInfo,
  FiMapPin,
  FiShare2,
  FiTrash2,
  FiUsers,
} from "react-icons/fi"
import { GiAmpleDress } from "react-icons/gi"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function EventDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session } = useSession()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGoing, setIsGoing] = useState(false)
  const [isInterested, setIsInterested] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [attendeesCount, setAttendeesCount] = useState(0)
  const [interestedCount, setInterestedCount] = useState(0)
  const [activeTab, setActiveTab] = useState<string>("overview")

  const isCreator = session?.profileId && event?.creatorId === session.profileId

  // Fetch event data
  useEffect(() => {
    async function fetchEvent() {
      try {
        const eventData = await eventsService.getById(id, session?.jwt || "")
        setEvent(eventData)

        // Check if user is going or interested
        if (session?.profileId) {
          const profile = await profilesService.getById(session.profileId, session.jwt)
          setIsGoing(profile.goingToEvents?.includes(id) || false)
          setIsInterested(profile.interestedEvents?.includes(id) || false)
        }

        // Get attendees count (placeholder - would need backend support)
        setAttendeesCount(Math.floor(Math.random() * 50) + 10)
        setInterestedCount(Math.floor(Math.random() * 30) + 5)

        setLoading(false)
      } catch (err: any) {
        console.error("Failed to fetch event:", err)
        setError(err.message || "Failed to load event")
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id, session])

  const handleGoingClick = async () => {
    if (!session?.jwt || !session?.profileId) {
      router.push("/login")
      return
    }
    if (!event?.id) return

    setIsUpdating(true)
    const newGoingState = !isGoing
    setIsGoing(newGoingState)

    try {
      const profile = await profilesService.getById(session.profileId, session.jwt)
      const currentGoingEvents = profile.goingToEvents || []

      let updatedGoingEvents: string[]
      if (newGoingState) {
        updatedGoingEvents = currentGoingEvents.includes(event.id)
          ? currentGoingEvents
          : [...currentGoingEvents, event.id]
        setAttendeesCount((prev) => prev + 1)
        // If going, remove from interested
        if (isInterested) {
          setIsInterested(false)
          setInterestedCount((prev) => Math.max(0, prev - 1))
        }
      } else {
        updatedGoingEvents = currentGoingEvents.filter((id) => id !== event.id)
        setAttendeesCount((prev) => Math.max(0, prev - 1))
      }

      const updatedInterestedEvents = newGoingState
        ? (profile.interestedEvents || []).filter((id) => id !== event.id)
        : profile.interestedEvents || []

      await profilesService.update(
        session.profileId,
        {
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
          phone: profile.phone,
          avatarUrl: profile.avatarUrl,
          goingToEvents: updatedGoingEvents,
          interestedEvents: updatedInterestedEvents,
        },
        session.jwt
      )
    } catch (err) {
      console.error("Failed to update going status:", err)
      setIsGoing(!newGoingState)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleInterestedClick = async () => {
    if (!session?.jwt || !session?.profileId) {
      router.push("/login")
      return
    }
    if (!event?.id) return

    setIsUpdating(true)
    const newInterestedState = !isInterested
    setIsInterested(newInterestedState)

    try {
      const profile = await profilesService.getById(session.profileId, session.jwt)
      const currentInterestedEvents = profile.interestedEvents || []

      let updatedInterestedEvents: string[]
      if (newInterestedState) {
        updatedInterestedEvents = currentInterestedEvents.includes(event.id)
          ? currentInterestedEvents
          : [...currentInterestedEvents, event.id]
        setInterestedCount((prev) => prev + 1)
      } else {
        updatedInterestedEvents = currentInterestedEvents.filter((id) => id !== event.id)
        setInterestedCount((prev) => Math.max(0, prev - 1))
      }

      await profilesService.update(
        session.profileId,
        {
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
          phone: profile.phone,
          avatarUrl: profile.avatarUrl,
          goingToEvents: profile.goingToEvents || [],
          interestedEvents: updatedInterestedEvents,
        },
        session.jwt
      )
    } catch (err) {
      console.error("Failed to update interested status:", err)
      setIsInterested(!newInterestedState)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEdit = () => {
    router.push(`/events/${id}/edit`)
  }

  const handleDelete = async () => {
    if (!session?.jwt || !event?.id) return
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.jwt}` },
      })
      router.push("/events")
    } catch (err) {
      console.error("Failed to delete event:", err)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  // Red and white theme colors
  const eventTheme = {
    primary: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
    accent: "#e53e3e", // Red accent
    iconColor: "#e53e3e",
    light: "#fff5f5", // Very light red
    bg: "white",
  }

  if (loading) {
    return (
      <Box minH="100vh" bg={eventTheme.light}>
        <Navigation />
        <Container maxW="container.md" py={20}>
          <VStack gap={4}>
            <Spinner size="xl" color={eventTheme.accent} />
            <Text color="gray.600">Loading event...</Text>
          </VStack>
        </Container>
      </Box>
    )
  }

  if (error || !event) {
    return (
      <Box minH="100vh" bg={eventTheme.light}>
        <Navigation />
        <Container maxW="container.md" py={20}>
          <Card p={8} textAlign="center" bg="white">
            <Heading fontSize="2xl" mb={4} color="gray.900">
              {error || "Event not found"}
            </Heading>
            <Button onClick={() => router.push("/events")}>
              <HStack gap={2}>
                <Icon as={FiArrowLeft} />
                <Text>Back to Events</Text>
              </HStack>
            </Button>
          </Card>
        </Container>
      </Box>
    )
  }

  const startDate = event.dateRange?.startAt ? new Date(event.dateRange.startAt) : null
  const endDate = event.dateRange?.endAt ? new Date(event.dateRange.endAt) : null

  // Tab configuration - include all available sections
  const tabs = [
    { id: "overview", label: "Overview", subtitle: "Complete information about this event", icon: FiInfo },
    {
      id: "schedule",
      label: "Schedule",
      subtitle: "Event timeline and activities",
      icon: FiCalendar,
      show: event.sections?.some((s) => s.type === "schedule"),
    },
    {
      id: "guests",
      label: "Guests & Speakers",
      subtitle: "Featured guests and speakers",
      icon: FiUsers,
      show: event.sections?.some((s) => s.type === "guests"),
    },
    {
      id: "tickets",
      label: "Tickets & Pricing",
      subtitle: "Available ticket options",
      icon: FiDollarSign,
      show: event.sections?.some((s) => s.type === "tickets"),
    },
    {
      id: "gallery",
      label: "Gallery",
      subtitle: "Event photos and visuals",
      icon: FiImage,
      show: event.sections?.some((s) => s.type === "images"),
    },
    {
      id: "faq",
      label: "FAQ",
      subtitle: "Frequently asked questions",
      icon: FiInfo,
      show: event.sections?.some((s) => s.type === "faq"),
    },
    {
      id: "resources",
      label: "Resources",
      subtitle: "Downloads and materials",
      icon: FiFile,
      show: event.sections?.some((s) => s.type === "resources"),
    },
    {
      id: "dresscode",
      label: "Dress Code",
      subtitle: "What to wear to this event",
      icon: GiAmpleDress,
      show: event.sections?.some((s) => s.type === "dresscode"),
    },
  ].filter((tab) => tab.show !== false)

  return (
    <Box minH="100vh" bg="white">
      <Navigation />

      <Container maxW="1200px" py={8}>
        {/* Header with Back Button */}
        <Button variant="ghost" onClick={() => router.push("/events")} mb={6} colorScheme="gray">
          <HStack gap={2}>
            <Icon as={FiArrowLeft} />
            <Text>Back to Events</Text>
          </HStack>
        </Button>

        {/* Event Hero - Red Gradient Banner */}
        <Box h="300px" borderRadius="xl" background={eventTheme.primary} position="relative" overflow="hidden" mb={8}>
          {event.imageUrl && (
            <Image src={event.imageUrl} alt={event.title} w="full" h="full" objectFit="cover" opacity={0.3} />
          )}
          <Box
            position="absolute"
            top="0"
            left="0"
            w="full"
            h="full"
            background="linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))"
            display="flex"
            alignItems="flex-end"
            p={8}
          >
            <VStack align="start" gap={3} color="white">
              <Heading fontSize="4xl" fontWeight="bold">
                {event.title}
              </Heading>
              {event.themes && event.themes.length > 0 && (
                <HStack gap={2} flexWrap="wrap">
                  {event.themes.map((theme) => (
                    <Badge key={theme} bg="whiteAlpha.300" color="white" px={3} py={1} borderRadius="full">
                      {theme}
                    </Badge>
                  ))}
                </HStack>
              )}
            </VStack>
          </Box>
        </Box>

        {/* Quick Info Bar - White Card with Red Accents */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={8}>
          <Box bg="white" p={5} borderRadius="lg" border="1px solid" borderColor="gray.200" shadow="sm">
            <HStack gap={3}>
              <Box p={2} bg="red.50" borderRadius="md">
                <Icon as={FiCalendar} color={eventTheme.accent} boxSize={5} />
              </Box>
              <VStack align="start" gap={0}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  DATE
                </Text>
                <Text fontWeight="semibold" color="gray.800">
                  {startDate ? formatDate(startDate) : "TBA"}
                </Text>
              </VStack>
            </HStack>
          </Box>
          <Box bg="white" p={5} borderRadius="lg" border="1px solid" borderColor="gray.200" shadow="sm">
            <HStack gap={3}>
              <Box p={2} bg="red.50" borderRadius="md">
                <Icon as={FiUsers} color={eventTheme.accent} boxSize={5} />
              </Box>
              <VStack align="start" gap={0}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  ATTENDEES
                </Text>
                <Text fontWeight="semibold" color="gray.800">
                  {attendeesCount} going
                </Text>
              </VStack>
            </HStack>
          </Box>
          <Box bg="white" p={5} borderRadius="lg" border="1px solid" borderColor="gray.200" shadow="sm">
            <HStack gap={3}>
              <Box p={2} bg="red.50" borderRadius="md">
                <Icon as={FiMapPin} color={eventTheme.accent} boxSize={5} />
              </Box>
              <VStack align="start" gap={0}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  LOCATION
                </Text>
                <Text fontWeight="semibold" color="gray.800" lineClamp={1}>
                  {event.location?.city || event.location?.venue || "TBA"}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </Grid>

        {/* Action Buttons */}
        <HStack gap={3} mb={8}>
          {isCreator ? (
            <>
              <Button
                onClick={handleEdit}
                bg={eventTheme.accent}
                color="white"
                _hover={{ bg: "red.600" }}
                flex="1"
                size="lg"
              >
                <HStack gap={2}>
                  <Icon as={FiEdit2} />
                  <Text>Edit Event</Text>
                </HStack>
              </Button>
              <Button onClick={handleDelete} colorScheme="red" variant="outline" flex="1" size="lg">
                <HStack gap={2}>
                  <Icon as={FiTrash2} />
                  <Text>Delete</Text>
                </HStack>
              </Button>
              <Button onClick={handleShare} variant="outline" colorScheme="gray" size="lg">
                <Icon as={FiShare2} />
              </Button>
            </>
          ) : (
            <>
              <Button
                bg={isGoing ? eventTheme.accent : "white"}
                color={isGoing ? "white" : "gray.700"}
                border="1px solid"
                borderColor={isGoing ? eventTheme.accent : "gray.300"}
                _hover={{ bg: isGoing ? "red.600" : "gray.50" }}
                onClick={handleGoingClick}
                disabled={isUpdating}
                flex="1"
                size="lg"
              >
                <HStack gap={2}>
                  <Icon as={FiUsers} />
                  <Text>{isGoing ? "Going" : "Join Event"}</Text>
                </HStack>
              </Button>
              <Button
                bg={isInterested ? "red.50" : "white"}
                color={isInterested ? eventTheme.accent : "gray.700"}
                border="1px solid"
                borderColor={isInterested ? eventTheme.accent : "gray.300"}
                _hover={{ bg: "red.50" }}
                onClick={handleInterestedClick}
                disabled={isUpdating}
                flex="1"
                size="lg"
              >
                <HStack gap={2}>
                  <Icon as={FiHeart} />
                  <Text>{isInterested ? "Interested" : "Maybe"}</Text>
                </HStack>
              </Button>
              <Button onClick={handleShare} variant="outline" colorScheme="gray" size="lg">
                <Icon as={FiShare2} />
              </Button>
            </>
          )}
        </HStack>

        {/* Tab Navigation - Clean White Tabs */}
        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" p={2} mb={6}>
          <HStack gap={2} overflowX="auto" css={{ "&::-webkit-scrollbar": { display: "none" } }}>
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                bg={activeTab === tab.id ? eventTheme.accent : "transparent"}
                color={activeTab === tab.id ? "white" : "gray.600"}
                _hover={{
                  bg: activeTab === tab.id ? "red.600" : "gray.50",
                }}
                borderRadius="md"
                px={4}
                py={2}
                size="sm"
                flex={{ base: "0 0 auto", md: "1" }}
              >
                <HStack gap={2}>
                  <Icon as={tab.icon} boxSize={4} />
                  <Text fontWeight="medium" fontSize="sm">
                    {tab.label}
                  </Text>
                </HStack>
              </Button>
            ))}
          </HStack>
        </Box>

        {/* Tab Content */}
        <Box>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <VStack align="stretch" gap={6}>
              {/* Description */}
              {event.description && (
                <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Heading fontSize="xl" mb={4} color="gray.800">
                    About This Event
                  </Heading>
                  <Text fontSize="md" lineHeight="tall" color="gray.600" whiteSpace="pre-wrap">
                    {event.description}
                  </Text>
                </Box>
              )}

              {/* Event Details */}
              <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="gray.200">
                <Heading fontSize="xl" mb={6} color="gray.800">
                  Event Details
                </Heading>
                <VStack align="stretch" gap={4}>
                  {/* Date & Time */}
                  <HStack gap={4} p={4} bg="red.50" borderRadius="md">
                    <Icon as={FiCalendar} color={eventTheme.accent} boxSize={5} />
                    <VStack align="start" gap={0}>
                      <Text fontWeight="semibold" color="gray.800">
                        {startDate ? formatDate(startDate) : "TBA"}
                      </Text>
                      {startDate && (
                        <Text fontSize="sm" color="gray.600">
                          {startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          {endDate &&
                            ` - ${endDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}
                        </Text>
                      )}
                    </VStack>
                  </HStack>

                  {/* Location */}
                  {event.location && (
                    <HStack gap={4} p={4} bg="red.50" borderRadius="md">
                      <Icon as={FiMapPin} color={eventTheme.accent} boxSize={5} />
                      <VStack align="start" gap={0}>
                        {event.location.venue && (
                          <Text fontWeight="semibold" color="gray.800">
                            {event.location.venue}
                          </Text>
                        )}
                        {event.location.address && (
                          <Text fontSize="sm" color="gray.600">
                            {event.location.address}
                          </Text>
                        )}
                        {event.location.city && (
                          <Text fontSize="sm" color="gray.600">
                            {event.location.city}
                            {event.location.country && `, ${event.location.country}`}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  )}

                  {/* Attendance */}
                  <HStack gap={4} p={4} bg="red.50" borderRadius="md">
                    <Icon as={FiUsers} color={eventTheme.accent} boxSize={5} />
                    <Text fontWeight="semibold" color="gray.800">
                      {attendeesCount} going · {interestedCount} interested
                    </Text>
                  </HStack>

                  {/* Age Restriction */}
                  {event.ageRestriction && (
                    <HStack gap={4} p={4} bg="red.50" borderRadius="md">
                      <Icon as={FiUsers} color={eventTheme.accent} boxSize={5} />
                      <Text fontWeight="semibold" color="gray.800">
                        {event.ageRestriction}+ only
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </Box>
            </VStack>
          )}

          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <VStack align="stretch" gap={6}>
              {event.sections?.find((s) => s.type === "schedule") ? (
                <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Heading fontSize="xl" mb={6} color="gray.800">
                    Event Schedule
                  </Heading>
                  <VStack align="stretch" gap={3}>
                    {event.sections
                      .filter((s) => s.type === "schedule")
                      .map(
                        (section, index) =>
                          section.type === "schedule" &&
                          section.items.map((item, itemIndex) => {
                            const scheduleTime = new Date(item.time)
                            const isValidDate = !isNaN(scheduleTime.getTime())

                            return (
                              <HStack
                                key={`${index}-${itemIndex}`}
                                gap={4}
                                p={5}
                                bg="red.50"
                                borderRadius="lg"
                                borderLeftWidth="4px"
                                borderLeftColor={eventTheme.accent}
                              >
                                <Box minW="80px">
                                  <Text fontWeight="bold" fontSize="lg" color={eventTheme.accent}>
                                    {isValidDate
                                      ? scheduleTime.toLocaleTimeString("en-US", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : "TBA"}
                                  </Text>
                                </Box>
                                <Text fontSize="md" fontWeight="medium" color="gray.700">
                                  {item.activity}
                                </Text>
                              </HStack>
                            )
                          })
                      )}
                  </VStack>
                </Box>
              ) : (
                <Box bg="white" p={12} textAlign="center" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Icon as={FiCalendar} boxSize={16} color="gray.300" mx="auto" mb={4} />
                  <Text color="gray.500" fontSize="lg">
                    No schedule information available
                  </Text>
                </Box>
              )}
            </VStack>
          )}

          {/* Guests Tab */}
          {activeTab === "guests" && (
            <VStack align="stretch" gap={6}>
              {event.sections?.find((s) => s.type === "guests") ? (
                <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Heading fontSize="xl" mb={6} color="gray.800">
                    Featured Guests & Speakers
                  </Heading>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                    {event.sections
                      .filter((s) => s.type === "guests")
                      .map(
                        (section, index) =>
                          section.type === "guests" &&
                          section.guests.map((guest, guestIndex) => (
                            <Box
                              key={`${index}-${guestIndex}`}
                              p={5}
                              bg="red.50"
                              borderRadius="lg"
                              borderWidth="1px"
                              borderColor="gray.200"
                              _hover={{ borderColor: eventTheme.accent, shadow: "sm" }}
                            >
                              <HStack gap={4} align="start">
                                {guest.avatarUrl && (
                                  <Image
                                    src={guest.avatarUrl}
                                    alt={guest.name}
                                    boxSize="60px"
                                    borderRadius="full"
                                    objectFit="cover"
                                  />
                                )}
                                <VStack align="start" gap={1} flex={1}>
                                  <Text fontWeight="bold" fontSize="md" color="gray.800">
                                    {guest.name}
                                  </Text>
                                  {guest.bio && (
                                    <Text fontSize="sm" color="gray.600" lineHeight="short">
                                      {guest.bio}
                                    </Text>
                                  )}
                                  {guest.social && (
                                    <Text fontSize="xs" color={eventTheme.accent}>
                                      {guest.social}
                                    </Text>
                                  )}
                                </VStack>
                              </HStack>
                            </Box>
                          ))
                      )}
                  </Grid>
                </Box>
              ) : (
                <Box bg="white" p={12} textAlign="center" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Icon as={FiUsers} boxSize={16} color="gray.300" mx="auto" mb={4} />
                  <Text color="gray.500" fontSize="lg">
                    No guest information available
                  </Text>
                </Box>
              )}
            </VStack>
          )}

          {/* Tickets Tab */}
          {activeTab === "tickets" && (
            <VStack align="stretch" gap={6}>
              {event.sections?.find((s) => s.type === "tickets") ? (
                <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Heading fontSize="xl" mb={6} color="gray.800">
                    Tickets & Pricing
                  </Heading>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                    {event.sections
                      .filter((s) => s.type === "tickets")
                      .map(
                        (section, index) =>
                          section.type === "tickets" &&
                          section.tickets.map((ticket, ticketIndex) => (
                            <Box
                              key={`${index}-${ticketIndex}`}
                              p={6}
                              bg="red.50"
                              borderRadius="lg"
                              borderWidth="1px"
                              borderColor="gray.200"
                              _hover={{
                                borderColor: eventTheme.accent,
                                shadow: "md",
                                transform: "translateY(-2px)",
                                transition: "all 0.2s",
                              }}
                            >
                              <VStack align="stretch" gap={3}>
                                <Text fontWeight="bold" fontSize="lg" color="gray.800">
                                  {ticket.type}
                                </Text>
                                <Heading fontSize="3xl" color={eventTheme.accent}>
                                  {ticket.currency || "$"}
                                  {ticket.price}
                                </Heading>
                                {ticket.link && (
                                  <Button
                                    bg={eventTheme.accent}
                                    color="white"
                                    _hover={{ bg: "red.600" }}
                                    size="sm"
                                    onClick={() => window.open(ticket.link, "_blank")}
                                  >
                                    Purchase
                                  </Button>
                                )}
                              </VStack>
                            </Box>
                          ))
                      )}
                  </Grid>
                </Box>
              ) : (
                <Box bg="white" p={12} textAlign="center" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Icon as={FiDollarSign} boxSize={16} color="gray.300" mx="auto" mb={4} />
                  <Text color="gray.500" fontSize="lg">
                    No ticket information available
                  </Text>
                </Box>
              )}
            </VStack>
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            <VStack align="stretch" gap={6}>
              {event.sections?.find((s) => s.type === "images") ? (
                <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Heading fontSize="xl" mb={6} color="gray.800">
                    Event Gallery
                  </Heading>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                    {event.sections
                      .filter((s) => s.type === "images")
                      .map(
                        (section, index) =>
                          section.type === "images" &&
                          section.srcs.map((src, imgIndex) => (
                            <Box
                              key={`${index}-${imgIndex}`}
                              position="relative"
                              paddingBottom="100%"
                              borderRadius="lg"
                              overflow="hidden"
                              border="1px solid"
                              borderColor="gray.200"
                              _hover={{
                                borderColor: eventTheme.accent,
                                transform: "scale(1.02)",
                                transition: "all 0.2s",
                                cursor: "pointer",
                                shadow: "md",
                              }}
                            >
                              <Image
                                src={src}
                                alt={`Gallery image ${imgIndex + 1}`}
                                position="absolute"
                                top="0"
                                left="0"
                                width="100%"
                                height="100%"
                                objectFit="cover"
                              />
                            </Box>
                          ))
                      )}
                  </Grid>
                </Box>
              ) : (
                <Box bg="white" p={12} textAlign="center" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Icon as={FiImage} boxSize={16} color="gray.300" mx="auto" mb={4} />
                  <Text color="gray.500" fontSize="lg">
                    No images available
                  </Text>
                </Box>
              )}
            </VStack>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <VStack align="stretch" gap={6}>
              {event.sections?.find((s) => s.type === "faq") ? (
                <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Heading fontSize="xl" mb={6} color="gray.800">
                    Frequently Asked Questions
                  </Heading>
                  <VStack align="stretch" gap={4}>
                    {event.sections
                      .filter((s) => s.type === "faq")
                      .map(
                        (section, index) =>
                          section.type === "faq" &&
                          section.items.map((faq, faqIndex) => (
                            <Box key={`${index}-${faqIndex}`} p={5} bg="red.50" borderRadius="lg">
                              <Text fontWeight="semibold" mb={2} color="gray.800" fontSize="md">
                                Q: {faq.question}
                              </Text>
                              <Text
                                color="gray.600"
                                lineHeight="tall"
                                pl={4}
                                borderLeftWidth="3px"
                                borderLeftColor={eventTheme.accent}
                              >
                                {faq.answer}
                              </Text>
                            </Box>
                          ))
                      )}
                  </VStack>
                </Box>
              ) : (
                <Box bg="white" p={12} textAlign="center" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Icon as={FiInfo} boxSize={16} color="gray.300" mx="auto" mb={4} />
                  <Text color="gray.500" fontSize="lg">
                    No FAQ available
                  </Text>
                </Box>
              )}
            </VStack>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <VStack align="stretch" gap={6}>
              {event.sections?.find((s) => s.type === "resources") ? (
                <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Heading fontSize="xl" mb={6} color="gray.800">
                    Resources & Downloads
                  </Heading>
                  <VStack align="stretch" gap={3}>
                    {event.sections
                      .filter((s) => s.type === "resources")
                      .map(
                        (section, index) =>
                          section.type === "resources" &&
                          section.files.map((file, fileIndex) => (
                            <HStack
                              key={`${index}-${fileIndex}`}
                              gap={4}
                              p={5}
                              bg="red.50"
                              borderRadius="lg"
                              borderWidth="1px"
                              borderColor="gray.200"
                              _hover={{ borderColor: eventTheme.accent, cursor: "pointer", shadow: "sm" }}
                              onClick={() => window.open(file.url, "_blank")}
                            >
                              <Box p={2} bg="white" borderRadius="md">
                                <Icon as={FiDownload} color={eventTheme.accent} boxSize={5} />
                              </Box>
                              <VStack align="start" gap={0} flex={1}>
                                <Text fontWeight="semibold" color="gray.800">
                                  {file.name}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                  Click to download
                                </Text>
                              </VStack>
                            </HStack>
                          ))
                      )}
                  </VStack>
                </Box>
              ) : (
                <Box bg="white" p={12} textAlign="center" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Icon as={FiFile} boxSize={16} color="gray.300" mx="auto" mb={4} />
                  <Text color="gray.500" fontSize="lg">
                    No resources available
                  </Text>
                </Box>
              )}
            </VStack>
          )}

          {/* Dress Code Tab */}
          {activeTab === "dresscode" && (
            <VStack align="stretch" gap={6}>
              {event.sections?.find((s) => s.type === "dresscode") ? (
                <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Heading fontSize="xl" mb={6} color="gray.800">
                    Dress Code
                  </Heading>
                  {event.sections
                    .filter((s) => s.type === "dresscode")
                    .map((section, index) => (
                      <Box key={index} p={5} bg="red.50" borderRadius="lg">
                        <HStack gap={3}>
                          <Icon as={GiAmpleDress} color={eventTheme.accent} boxSize={6} />
                          <Text lineHeight="tall" fontWeight="medium" color="gray.700">
                            {section.type === "dresscode" && section.content}
                          </Text>
                        </HStack>
                      </Box>
                    ))}
                </Box>
              ) : (
                <Box bg="white" p={12} textAlign="center" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Icon as={GiAmpleDress} boxSize={16} color="gray.300" mx="auto" mb={4} />
                  <Text color="gray.500" fontSize="lg">
                    No dress code specified
                  </Text>
                </Box>
              )}
            </VStack>
          )}
        </Box>
      </Container>
    </Box>
  )
}
