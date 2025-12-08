"use client"

import { eventsService } from "@/lib/api/services/events"
import { profilesService } from "@/lib/api/services/profiles"
import { Navigation } from "@/shared/components/layout/Navigation"
import { Badge } from "@/shared/components/ui/Badge"
import { Button } from "@/shared/components/ui/Button"
import { Card } from "@/shared/components/ui/Card"
import type { Event } from "@/shared/types"
import { formatDate } from "@/shared/utils/helpers"
import { Box, Container, Grid, Heading, HStack, Icon, Image, Spinner, Text, VStack } from "@chakra-ui/react"
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
  FiStar,
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

  if (loading) {
    return (
      <Box minH="100vh" bg="bg.canvas">
        <Navigation />
        <Container maxW="container.md" py={20}>
          <VStack gap={4}>
            <Spinner size="xl" color="brand.primary" />
            <Text color="fg.muted">Loading event...</Text>
          </VStack>
        </Container>
      </Box>
    )
  }

  if (error || !event) {
    return (
      <Box minH="100vh" bg="bg.canvas">
        <Navigation />
        <Container maxW="container.md" py={20}>
          <Card p={8} textAlign="center">
            <Heading fontSize="2xl" mb={4}>
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

  // Red theme colors
  const eventTheme = {
    primary: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
    accent: "#ff6b6b",
    iconColor: "#ee5a6f",
    light: "#ffe0e0",
  }

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

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0]

  return (
    <Box minH="100vh" bg="bg.canvas">
      <Navigation />

      {/* Back Button */}
      <Container maxW="container.xl" pt={4}>
        <Button variant="ghost" onClick={() => router.push("/events")}>
          <HStack gap={2}>
            <Icon as={FiArrowLeft} />
            <Text>Back to Events</Text>
          </HStack>
        </Button>
      </Container>

      <Container maxW="container.xl" py={8}>
        <VStack align="stretch" gap={6}>
          {/* Hero Header Card */}
          <Box
            p={8}
            borderRadius="2xl"
            background={eventTheme.primary}
            color="white"
            position="relative"
            overflow="hidden"
            shadow="xl"
          >
            <Box position="absolute" top={4} right={4} opacity={0.15}>
              <Icon as={FiStar} boxSize={32} />
            </Box>
            <VStack align="start" gap={4} position="relative" zIndex={1}>
              <HStack gap={3}>
                <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                  <Icon as={FiStar} boxSize={6} />
                </Box>
                <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="black" letterSpacing="tight">
                  {event.title}
                </Heading>
              </HStack>

              {/* Themes */}
              {event.themes && event.themes.length > 0 && (
                <HStack gap={2} flexWrap="wrap">
                  {event.themes.map((theme) => (
                    <Badge
                      key={theme}
                      px={3}
                      py={1}
                      borderRadius="full"
                      bg="whiteAlpha.300"
                      color="white"
                      fontWeight="semibold"
                    >
                      {theme}
                    </Badge>
                  ))}
                </HStack>
              )}

              {/* Quick Info */}
              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} w="full" mt={2}>
                <Box p={4} bg="whiteAlpha.200" borderRadius="lg" backdropFilter="blur(10px)">
                  <HStack gap={2}>
                    <Icon as={FiCalendar} boxSize={5} />
                    <VStack align="start" gap={0}>
                      <Text fontSize="xs" opacity={0.9}>
                        Date
                      </Text>
                      <Text fontWeight="bold" fontSize="sm">
                        {startDate ? formatDate(startDate) : "TBA"}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
                <Box p={4} bg="whiteAlpha.200" borderRadius="lg" backdropFilter="blur(10px)">
                  <HStack gap={2}>
                    <Icon as={FiUsers} boxSize={5} />
                    <VStack align="start" gap={0}>
                      <Text fontSize="xs" opacity={0.9}>
                        Attendees
                      </Text>
                      <Text fontWeight="bold" fontSize="sm">
                        {attendeesCount} going
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
                <Box p={4} bg="whiteAlpha.200" borderRadius="lg" backdropFilter="blur(10px)">
                  <HStack gap={2}>
                    <Icon as={FiMapPin} boxSize={5} />
                    <VStack align="start" gap={0}>
                      <Text fontSize="xs" opacity={0.9}>
                        Location
                      </Text>
                      <Text fontWeight="bold" fontSize="sm" lineClamp={1}>
                        {event.location?.city || event.location?.venue || "TBA"}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </Grid>

              {/* Action Buttons */}
              <HStack gap={3} w="full" mt={4}>
                {isCreator ? (
                  <>
                    <Button
                      onClick={handleEdit}
                      size="lg"
                      bg="whiteAlpha.300"
                      color="white"
                      _hover={{ bg: "whiteAlpha.400" }}
                      flex="1"
                    >
                      <HStack gap={2}>
                        <Icon as={FiEdit2} boxSize={4} />
                        <Text>Edit Event</Text>
                      </HStack>
                    </Button>
                    <Button
                      onClick={handleDelete}
                      size="lg"
                      bg="red.600"
                      color="white"
                      _hover={{ bg: "red.700" }}
                      flex="1"
                    >
                      <HStack gap={2}>
                        <Icon as={FiTrash2} boxSize={4} />
                        <Text>Delete Event</Text>
                      </HStack>
                    </Button>
                    <Button
                      onClick={handleShare}
                      size="lg"
                      bg="whiteAlpha.200"
                      color="white"
                      _hover={{ bg: "whiteAlpha.300" }}
                      flex="1"
                    >
                      <HStack gap={2}>
                        <Icon as={FiShare2} boxSize={4} />
                        <Text>Share</Text>
                      </HStack>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      bg={isGoing ? "whiteAlpha.400" : "whiteAlpha.200"}
                      color="white"
                      _hover={{ bg: "whiteAlpha.300" }}
                      onClick={handleGoingClick}
                      disabled={isUpdating}
                      size="lg"
                      flex="1"
                    >
                      <HStack gap={2}>
                        <Icon as={FiUsers} boxSize={4} />
                        <Text>{isGoing ? "You're Going!" : "Join Event"}</Text>
                      </HStack>
                    </Button>
                    <Button
                      bg={isInterested ? "whiteAlpha.400" : "whiteAlpha.200"}
                      color="white"
                      _hover={{ bg: "whiteAlpha.300" }}
                      onClick={handleInterestedClick}
                      disabled={isUpdating}
                      size="lg"
                      flex="1"
                    >
                      <HStack gap={2}>
                        <Icon as={FiHeart} boxSize={4} />
                        <Text>{isInterested ? "Interested" : "Maybe Later"}</Text>
                      </HStack>
                    </Button>
                    <Button
                      onClick={handleShare}
                      size="lg"
                      bg="whiteAlpha.200"
                      color="white"
                      _hover={{ bg: "whiteAlpha.300" }}
                      flex="1"
                    >
                      <HStack gap={2}>
                        <Icon as={FiShare2} boxSize={4} />
                        <Text>Share</Text>
                      </HStack>
                    </Button>
                  </>
                )}
              </HStack>
            </VStack>
          </Box>

          {/* Tab Navigation */}
          <Card p={2}>
            <HStack gap={2} overflowX="auto" css={{ "&::-webkit-scrollbar": { display: "none" } }}>
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  bg={activeTab === tab.id ? eventTheme.accent : "transparent"}
                  color={activeTab === tab.id ? "white" : "fg.default"}
                  _hover={{
                    bg: activeTab === tab.id ? eventTheme.accent : "bg.muted",
                  }}
                  borderRadius="lg"
                  px={6}
                  py={5}
                  flex={{ base: "0 0 auto", md: "1" }}
                >
                  <HStack gap={2}>
                    <Icon as={tab.icon} boxSize={5} />
                    <Text fontWeight="semibold">{tab.label}</Text>
                  </HStack>
                </Button>
              ))}
            </HStack>
          </Card>

          {/* Tab Content */}
          <Box>
            {/* Tab Header - Single header for current tab */}
            <Box
              mb={8}
              p={8}
              borderRadius="2xl"
              background={{
                base: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                _dark: "linear-gradient(135deg, #C53030 0%, #9B2C2C 100%)",
              }}
              color="white"
              position="relative"
              overflow="hidden"
              shadow="lg"
            >
              <Box position="absolute" top={4} right={4} opacity={0.2}>
                <Icon as={currentTab.icon} boxSize={24} />
              </Box>
              <VStack align="start" gap={2} position="relative" zIndex={1}>
                <HStack gap={3}>
                  <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                    <Icon as={currentTab.icon} boxSize={6} />
                  </Box>
                  <Heading fontSize="3xl" fontWeight="bold">
                    {currentTab.label}
                  </Heading>
                </HStack>
                <Text fontSize="lg" opacity={0.9}>
                  {currentTab.subtitle}
                </Text>
              </VStack>
            </Box>

            {/* Tab Content Card - Single card for all content */}
            <Card
              p={8}
              bg={{ base: "red.50", _dark: "red.900/20" }}
              borderWidth="2px"
              borderColor={{ base: "red.200", _dark: "red.700" }}
            >
              <VStack align="stretch" gap={6}>
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <VStack align="stretch" gap={6}>
                    {/* Event Image */}
                    {event.imageUrl && (
                      <Box>
                        {/* Header */}
                        <Box
                          mb={6}
                          p={8}
                          borderRadius="2xl"
                          background={{
                            base: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                            _dark: "linear-gradient(135deg, #C53030 0%, #9B2C2C 100%)",
                          }}
                          position="relative"
                          overflow="hidden"
                          shadow="lg"
                        >
                          <Icon
                            as={FiImage}
                            position="absolute"
                            top={4}
                            right={4}
                            boxSize={24}
                            color="whiteAlpha.200"
                            opacity={0.2}
                          />
                          <VStack align="start" gap={2} position="relative" zIndex={1}>
                            <HStack gap={3}>
                              <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                                <Icon as={FiImage} color="white" boxSize={6} />
                              </Box>
                              <Heading fontSize="3xl" fontWeight="bold" color="white">
                                Event Preview
                              </Heading>
                            </HStack>
                          </VStack>
                        </Box>
                        {/* Content */}
                        <Card
                          p={6}
                          bg={{ base: "red.50", _dark: "red.900/20" }}
                          borderWidth="2px"
                          borderColor={{ base: "red.200", _dark: "red.700" }}
                        >
                          <Box borderRadius="xl" overflow="hidden" width="100%">
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              width="100%"
                              height="400px"
                              objectFit="cover"
                            />
                          </Box>
                        </Card>
                      </Box>
                    )}

                    {/* About Section */}
                    {event.description && (
                      <Box>
                        {/* Header */}
                        <Box
                          mb={6}
                          p={8}
                          borderRadius="2xl"
                          background={{
                            base: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                            _dark: "linear-gradient(135deg, #C53030 0%, #9B2C2C 100%)",
                          }}
                          position="relative"
                          overflow="hidden"
                          shadow="lg"
                        >
                          <Icon
                            as={FiInfo}
                            position="absolute"
                            top={4}
                            right={4}
                            boxSize={24}
                            color="whiteAlpha.200"
                            opacity={0.2}
                          />
                          <VStack align="start" gap={2} position="relative" zIndex={1}>
                            <HStack gap={3}>
                              <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                                <Icon as={FiInfo} color="white" boxSize={6} />
                              </Box>
                              <Heading fontSize="3xl" fontWeight="bold" color="white">
                                About This Event
                              </Heading>
                            </HStack>
                          </VStack>
                        </Box>
                        {/* Content */}
                        <Card
                          p={8}
                          bg={{ base: "red.50", _dark: "red.900/20" }}
                          borderWidth="2px"
                          borderColor={{ base: "red.200", _dark: "red.700" }}
                        >
                          <Text fontSize="md" lineHeight="tall" whiteSpace="pre-wrap" color="fg.default">
                            {event.description}
                          </Text>
                        </Card>
                      </Box>
                    )}

                    {/* Event Information */}
                    <Box
                      p={8}
                      borderRadius="2xl"
                      background={{
                        base: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                        _dark: "linear-gradient(135deg, #2C5282 0%, #553C9A 100%)",
                      }}
                      position="relative"
                      overflow="hidden"
                    >
                      <Icon
                        as={FiCalendar}
                        position="absolute"
                        top={-4}
                        right={-4}
                        boxSize={24}
                        color="whiteAlpha.200"
                        opacity={0.2}
                        transform="rotate(15deg)"
                      />
                      <VStack align="start" gap={5} position="relative" zIndex={1}>
                        <HStack gap={3}>
                          <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                            <Icon as={FiCalendar} color="white" boxSize={6} />
                          </Box>
                          <Heading fontSize="3xl" fontWeight="bold" color="white">
                            Event Information
                          </Heading>
                        </HStack>

                        {/* Date & Time */}
                        <HStack gap={4} p={5} bg="whiteAlpha.200" borderRadius="xl" width="100%">
                          <Icon as={FiCalendar} color="white" boxSize={6} />
                          <VStack align="start" gap={1}>
                            <Text fontWeight="semibold" color="white">
                              {startDate ? formatDate(startDate) : "TBA"}
                            </Text>
                            {startDate && (
                              <Text fontSize="sm" color="whiteAlpha.900">
                                {startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                {endDate &&
                                  ` - ${endDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}
                              </Text>
                            )}
                          </VStack>
                        </HStack>

                        {/* Location */}
                        {event.location && (
                          <HStack gap={4} p={5} bg="whiteAlpha.200" borderRadius="xl" width="100%">
                            <Icon as={FiMapPin} color="white" boxSize={6} />
                            <VStack align="start" gap={1}>
                              {event.location.venue && (
                                <Text fontWeight="semibold" color="white">
                                  {event.location.venue}
                                </Text>
                              )}
                              {event.location.address && (
                                <Text fontSize="sm" color="whiteAlpha.900">
                                  {event.location.address}
                                </Text>
                              )}
                              {event.location.city && (
                                <Text fontSize="sm" color="whiteAlpha.900">
                                  {event.location.city}
                                  {event.location.country && `, ${event.location.country}`}
                                </Text>
                              )}
                            </VStack>
                          </HStack>
                        )}

                        {/* Attendance */}
                        <HStack gap={4} p={5} bg="whiteAlpha.200" borderRadius="xl" width="100%">
                          <Icon as={FiUsers} color="white" boxSize={6} />
                          <Text fontWeight="semibold" color="white">
                            {attendeesCount} going · {interestedCount} interested
                          </Text>
                        </HStack>

                        {/* Age Restriction */}
                        {event.ageRestriction && (
                          <HStack gap={4} p={5} bg="whiteAlpha.200" borderRadius="xl" width="100%">
                            <Icon as={FiUsers} color="white" boxSize={6} />
                            <Text fontWeight="semibold" color="white">
                              {event.ageRestriction}+ only
                            </Text>
                          </HStack>
                        )}
                      </VStack>
                    </Box>
                  </VStack>
                )}

                {/* Guests Tab */}
                {activeTab === "guests" && (
                  <VStack align="stretch" gap={6}>
                    {event.sections?.find((s) => s.type === "guests") ? (
                      <Box>
                        {/* Header */}
                        <Box
                          mb={6}
                          p={8}
                          borderRadius="2xl"
                          background={{
                            base: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                            _dark: "linear-gradient(135deg, #C53030 0%, #9B2C2C 100%)",
                          }}
                          position="relative"
                          overflow="hidden"
                          shadow="lg"
                        >
                          <Icon
                            as={FiUsers}
                            position="absolute"
                            top={4}
                            right={4}
                            boxSize={24}
                            color="whiteAlpha.200"
                            opacity={0.2}
                          />
                          <VStack align="start" gap={2} position="relative" zIndex={1}>
                            <HStack gap={3}>
                              <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                                <Icon as={FiUsers} color="white" boxSize={6} />
                              </Box>
                              <Heading fontSize="3xl" fontWeight="bold" color="white">
                                Featured Guests & Speakers
                              </Heading>
                            </HStack>
                          </VStack>
                        </Box>
                        {/* Content */}
                        <Card
                          p={8}
                          bg={{ base: "red.50", _dark: "red.900/20" }}
                          borderWidth="2px"
                          borderColor={{ base: "red.200", _dark: "red.700" }}
                        >
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
                                      bg="bg.muted"
                                      borderRadius="xl"
                                      borderWidth="1px"
                                      borderColor="border.default"
                                      _hover={{ borderColor: eventTheme.accent }}
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
                                          <Text fontWeight="bold" fontSize="md">
                                            {guest.name}
                                          </Text>
                                          {guest.bio && (
                                            <Text fontSize="sm" color="fg.muted" lineHeight="short">
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
                        </Card>
                      </Box>
                    ) : (
                      <Card p={12} textAlign="center" bg="bg.surface">
                        <Icon as={FiUsers} boxSize={16} color="fg.muted" mx="auto" mb={4} />
                        <Text color="fg.muted" fontSize="lg">
                          No guest information available
                        </Text>
                      </Card>
                    )}
                  </VStack>
                )}

                {/* Schedule Tab */}
                {activeTab === "schedule" && (
                  <VStack align="stretch" gap={6}>
                    {event.sections?.find((s) => s.type === "schedule") ? (
                      <Box>
                        {/* Header */}
                        <Box
                          mb={6}
                          p={8}
                          borderRadius="2xl"
                          background={{
                            base: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                            _dark: "linear-gradient(135deg, #C53030 0%, #9B2C2C 100%)",
                          }}
                          position="relative"
                          overflow="hidden"
                          shadow="lg"
                        >
                          <Icon
                            as={FiCalendar}
                            position="absolute"
                            top={4}
                            right={4}
                            boxSize={24}
                            color="whiteAlpha.200"
                            opacity={0.2}
                          />
                          <VStack align="start" gap={2} position="relative" zIndex={1}>
                            <HStack gap={3}>
                              <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                                <Icon as={FiCalendar} color="white" boxSize={6} />
                              </Box>
                              <Heading fontSize="3xl" fontWeight="bold" color="white">
                                Event Schedule
                              </Heading>
                            </HStack>
                          </VStack>
                        </Box>
                        {/* Content */}
                        <Card
                          p={8}
                          bg={{ base: "red.50", _dark: "red.900/20" }}
                          borderWidth="2px"
                          borderColor={{ base: "red.200", _dark: "red.700" }}
                        >
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
                                        bg="bg.muted"
                                        borderRadius="xl"
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
                                        <Text fontSize="md" fontWeight="medium">
                                          {item.activity}
                                        </Text>
                                      </HStack>
                                    )
                                  })
                              )}
                          </VStack>
                        </Card>
                      </Box>
                    ) : (
                      <Card p={12} textAlign="center" bg="bg.surface">
                        <Icon as={FiCalendar} boxSize={16} color="fg.muted" mx="auto" mb={4} />
                        <Text color="fg.muted" fontSize="lg">
                          No schedule information available
                        </Text>
                      </Card>
                    )}
                  </VStack>
                )}

                {/* FAQ Tab */}
                {activeTab === "faq" && (
                  <VStack align="stretch" gap={6}>
                    {event.sections?.find((s) => s.type === "faq") ? (
                      <Box
                        p={8}
                        borderRadius="2xl"
                        background={{
                          base: "linear-gradient(135deg, #A8EDEA 0%, #B721FF 100%)",
                          _dark: "linear-gradient(135deg, #553C9A 0%, #6B46C1 100%)",
                        }}
                        position="relative"
                        overflow="hidden"
                      >
                        <Icon
                          as={FiInfo}
                          position="absolute"
                          top={-4}
                          right={-4}
                          boxSize={24}
                          color="whiteAlpha.200"
                          opacity={0.2}
                          transform="rotate(15deg)"
                        />
                        <VStack align="start" gap={5} position="relative" zIndex={1}>
                          <HStack gap={3}>
                            <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                              <Icon as={FiInfo} color="white" boxSize={6} />
                            </Box>
                            <Heading fontSize="3xl" fontWeight="bold" color="white">
                              Frequently Asked Questions
                            </Heading>
                          </HStack>
                          <VStack align="stretch" gap={4} width="100%">
                            {event.sections
                              .filter((s) => s.type === "faq")
                              .map(
                                (section, index) =>
                                  section.type === "faq" &&
                                  section.items.map((faq, faqIndex) => (
                                    <Box key={`${index}-${faqIndex}`} p={5} bg="whiteAlpha.200" borderRadius="xl">
                                      <Text fontWeight="semibold" mb={2} color="white" fontSize="md">
                                        Q: {faq.question}
                                      </Text>
                                      <Text
                                        color="whiteAlpha.900"
                                        lineHeight="tall"
                                        pl={4}
                                        borderLeftWidth="3px"
                                        borderLeftColor="whiteAlpha.400"
                                      >
                                        {faq.answer}
                                      </Text>
                                    </Box>
                                  ))
                              )}
                          </VStack>
                        </VStack>
                      </Box>
                    ) : (
                      <Card p={12} textAlign="center" bg="bg.surface">
                        <Icon as={FiInfo} boxSize={16} color="fg.muted" mx="auto" mb={4} />
                        <Text color="fg.muted" fontSize="lg">
                          No FAQ available
                        </Text>
                      </Card>
                    )}
                  </VStack>
                )}

                {/* Resources Tab */}
                {activeTab === "resources" && (
                  <VStack align="stretch" gap={6}>
                    {event.sections?.find((s) => s.type === "resources") ? (
                      <Box>
                        {/* Header */}
                        <Box
                          mb={6}
                          p={8}
                          borderRadius="2xl"
                          background={{
                            base: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                            _dark: "linear-gradient(135deg, #C53030 0%, #9B2C2C 100%)",
                          }}
                          position="relative"
                          overflow="hidden"
                          shadow="lg"
                        >
                          <Icon
                            as={FiFile}
                            position="absolute"
                            top={4}
                            right={4}
                            boxSize={24}
                            color="whiteAlpha.200"
                            opacity={0.2}
                          />
                          <VStack align="start" gap={2} position="relative" zIndex={1}>
                            <HStack gap={3}>
                              <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                                <Icon as={FiFile} color="white" boxSize={6} />
                              </Box>
                              <Heading fontSize="3xl" fontWeight="bold" color="white">
                                Resources & Downloads
                              </Heading>
                            </HStack>
                          </VStack>
                        </Box>
                        {/* Content */}
                        <Card
                          p={8}
                          bg={{ base: "red.50", _dark: "red.900/20" }}
                          borderWidth="2px"
                          borderColor={{ base: "red.200", _dark: "red.700" }}
                        >
                          <VStack align="stretch" gap={3}>
                            {event.sections
                              .filter((s) => s.type === "resources")
                              .map(
                                (section, index) =>
                                  section.type === "resources" &&
                                  section.files.map((file, fileIndex) => (
                                    <Box
                                      key={`${index}-${fileIndex}`}
                                      p={5}
                                      bg="bg.muted"
                                      borderRadius="xl"
                                      borderWidth="1px"
                                      borderColor="border.default"
                                      _hover={{
                                        borderColor: eventTheme.accent,
                                        cursor: "pointer",
                                      }}
                                      onClick={() => window.open(file.url, "_blank")}
                                    >
                                      <HStack justify="space-between">
                                        <HStack gap={3}>
                                          <Icon as={FiFile} color={eventTheme.accent} boxSize={5} />
                                          <Text fontWeight="medium">{file.name}</Text>
                                        </HStack>
                                        <Icon as={FiDownload} color="fg.muted" />
                                      </HStack>
                                    </Box>
                                  ))
                              )}
                          </VStack>
                        </Card>
                      </Box>
                    ) : (
                      <Card p={12} textAlign="center" bg="bg.surface">
                        <Icon as={FiFile} boxSize={16} color="fg.muted" mx="auto" mb={4} />
                        <Text color="fg.muted" fontSize="lg">
                          No resources available
                        </Text>
                      </Card>
                    )}
                  </VStack>
                )}

                {/* Dress Code Tab */}
                {activeTab === "dresscode" && (
                  <VStack align="stretch" gap={6}>
                    {event.sections?.find((s) => s.type === "dresscode") ? (
                      <Box>
                        {/* Header */}
                        <Box
                          mb={6}
                          p={8}
                          borderRadius="2xl"
                          background={{
                            base: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                            _dark: "linear-gradient(135deg, #C53030 0%, #9B2C2C 100%)",
                          }}
                          position="relative"
                          overflow="hidden"
                          shadow="lg"
                        >
                          <Icon
                            as={GiAmpleDress}
                            position="absolute"
                            top={4}
                            right={4}
                            boxSize={24}
                            color="whiteAlpha.200"
                            opacity={0.2}
                          />
                          <VStack align="start" gap={2} position="relative" zIndex={1}>
                            <HStack gap={3}>
                              <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                                <Icon as={GiAmpleDress} color="white" boxSize={6} />
                              </Box>
                              <Heading fontSize="3xl" fontWeight="bold" color="white">
                                Dress Code
                              </Heading>
                            </HStack>
                          </VStack>
                        </Box>
                        {/* Content */}
                        <Card
                          p={8}
                          bg={{ base: "red.50", _dark: "red.900/20" }}
                          borderWidth="2px"
                          borderColor={{ base: "red.200", _dark: "red.700" }}
                        >
                          {event.sections
                            .filter((s) => s.type === "dresscode")
                            .map((section, index) => (
                              <Box key={index} p={5} bg="bg.muted" borderRadius="xl">
                                <HStack gap={3}>
                                  <Icon as={GiAmpleDress} color={eventTheme.accent} boxSize={6} />
                                  <Text lineHeight="tall" fontWeight="medium">
                                    {section.type === "dresscode" && section.content}
                                  </Text>
                                </HStack>
                              </Box>
                            ))}
                        </Card>
                      </Box>
                    ) : (
                      <Card p={12} textAlign="center" bg="bg.surface">
                        <Icon as={GiAmpleDress} boxSize={16} color="fg.muted" mx="auto" mb={4} />
                        <Text color="fg.muted" fontSize="lg">
                          No dress code specified
                        </Text>
                      </Card>
                    )}
                  </VStack>
                )}

                {/* Tickets Tab */}
                {activeTab === "tickets" && (
                  <VStack align="stretch" gap={6}>
                    {event.sections?.find((s) => s.type === "tickets") ? (
                      <Box
                        p={8}
                        borderRadius="2xl"
                        background={{
                          base: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                          _dark: "linear-gradient(135deg, #2C5282 0%, #553C9A 100%)",
                        }}
                        position="relative"
                        overflow="hidden"
                      >
                        <Icon
                          as={FiDollarSign}
                          position="absolute"
                          top={-4}
                          right={-4}
                          boxSize={24}
                          color="whiteAlpha.200"
                          opacity={0.2}
                          transform="rotate(15deg)"
                        />
                        <VStack align="start" gap={5} position="relative" zIndex={1}>
                          <HStack gap={3}>
                            <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                              <Icon as={FiDollarSign} color="white" boxSize={6} />
                            </Box>
                            <Heading fontSize="3xl" fontWeight="bold" color="white">
                              Tickets & Pricing
                            </Heading>
                          </HStack>
                          <Grid
                            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                            gap={4}
                            width="100%"
                          >
                            {event.sections
                              .filter((s) => s.type === "tickets")
                              .map(
                                (section, index) =>
                                  section.type === "tickets" &&
                                  section.tickets.map((ticket, ticketIndex) => (
                                    <Box
                                      key={`${index}-${ticketIndex}`}
                                      p={6}
                                      bg="whiteAlpha.200"
                                      borderRadius="xl"
                                      _hover={{
                                        bg: "whiteAlpha.300",
                                        transform: "translateY(-4px)",
                                        shadow: "lg",
                                        transition: "all 0.3s",
                                      }}
                                    >
                                      <VStack align="stretch" gap={3}>
                                        <Text fontWeight="bold" fontSize="lg" color="white">
                                          {ticket.type}
                                        </Text>
                                        <Heading fontSize="3xl" color="white">
                                          {ticket.currency || "$"}
                                          {ticket.price}
                                        </Heading>
                                        {ticket.link && (
                                          <Button
                                            bg="whiteAlpha.300"
                                            color="white"
                                            _hover={{ bg: "whiteAlpha.400" }}
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
                        </VStack>
                      </Box>
                    ) : (
                      <Card p={12} textAlign="center" bg="bg.surface">
                        <Icon as={FiDollarSign} boxSize={16} color="fg.muted" mx="auto" mb={4} />
                        <Text color="fg.muted" fontSize="lg">
                          No ticket information available
                        </Text>
                      </Card>
                    )}
                  </VStack>
                )}

                {/* Gallery Tab */}
                {activeTab === "gallery" && (
                  <VStack align="stretch" gap={6}>
                    {event.sections?.find((s) => s.type === "images") ? (
                      <Box
                        p={8}
                        borderRadius="2xl"
                        background={{
                          base: "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)",
                          _dark: "linear-gradient(135deg, #97266D 0%, #B83280 100%)",
                        }}
                        position="relative"
                        overflow="hidden"
                      >
                        <Icon
                          as={FiImage}
                          position="absolute"
                          top={-4}
                          right={-4}
                          boxSize={24}
                          color="whiteAlpha.200"
                          opacity={0.2}
                          transform="rotate(15deg)"
                        />
                        <VStack align="start" gap={5} position="relative" zIndex={1}>
                          <HStack gap={3}>
                            <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                              <Icon as={FiImage} color="white" boxSize={6} />
                            </Box>
                            <Heading fontSize="3xl" fontWeight="bold" color="white">
                              Event Gallery
                            </Heading>
                          </HStack>
                          <Grid
                            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                            gap={4}
                            width="100%"
                          >
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
                                      bg="whiteAlpha.200"
                                      _hover={{
                                        bg: "whiteAlpha.300",
                                        transform: "scale(1.02)",
                                        transition: "all 0.3s",
                                        cursor: "pointer",
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
                        </VStack>
                      </Box>
                    ) : (
                      <Card p={12} textAlign="center" bg="bg.surface">
                        <Icon as={FiImage} boxSize={16} color="fg.muted" mx="auto" mb={4} />
                        <Text color="fg.muted" fontSize="lg">
                          No images available
                        </Text>
                      </Card>
                    )}
                  </VStack>
                )}
              </VStack>
            </Card>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
