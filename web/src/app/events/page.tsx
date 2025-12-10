"use client"

import { useAllEvents } from "@/features/events/hooks/useAllEvents"
import { EventCardNew } from "@/features/profile/components/EventCardNew"
import { profilesService } from "@/lib/api/services/profiles"
import { Navigation } from "@/shared/components/layout/Navigation"
import { EmptyState } from "@/shared/components/ui/EmptyState"
import { EventCardSkeletonGrid } from "@/shared/components/ui/Skeleton"
import type { Event, EventThemeName } from "@/shared/types"
import { Box, Container, Grid, Heading, HStack, Icon, Input, Text, VStack } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { FiActivity, FiCoffee, FiCompass, FiHeart, FiSearch, FiStar, FiUsers, FiZap } from "react-icons/fi"

type MoodType = "energize" | "relax" | "connect" | "explore" | "inspire"

interface MoodOption {
  id: MoodType
  icon: any
  label: string
  subtitle: string
  themes: EventThemeName[]
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: "energize",
    icon: FiZap,
    label: "Energize",
    subtitle: "High energy events",
    themes: ["Music", "Dance", "Sports", "Fitness", "Party", "Festival", "Tournament", "Show"],
  },
  {
    id: "relax",
    icon: FiCoffee,
    label: "Relax",
    subtitle: "Peaceful experiences",
    themes: ["Wellness", "Health", "Nature", "Spirituality", "Retreat", "Picnic", "Food"],
  },
  {
    id: "connect",
    icon: FiUsers,
    label: "Connect",
    subtitle: "Meet new people",
    themes: ["Networking", "Social", "Meetup", "Workshop", "Business", "Seminar", "Conference"],
  },
  {
    id: "explore",
    icon: FiCompass,
    label: "Explore",
    subtitle: "New adventures",
    themes: ["Adventure", "Travel", "Nature", "Tour", "Market", "Exhibition"],
  },
  {
    id: "inspire",
    icon: FiStar,
    label: "Inspire",
    subtitle: "Creative & cultural",
    themes: ["Art", "Theater", "Film", "Photography", "Literature", "Crafts", "Exhibition", "Show", "Open Mic"],
  },
]

export default function EventsPage() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [quickFilter, setQuickFilter] = useState<string | null>(null)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [userGoingEvents, setUserGoingEvents] = useState<string[]>([])
  const [userInterestedEvents, setUserInterestedEvents] = useState<string[]>([])
  const [userProfile, setUserProfile] = useState<{
    name: string
    email: string
    bio?: string
    phone?: string
    avatarUrl?: string
  } | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { events, loading, updateEventAttendance } = useAllEvents()
  const { data: session } = useSession()

  // Fetch user's profile to get their events
  const fetchUserProfile = async () => {
    const jwt = session?.jwt
    const profileId = session?.profileId

    if (!jwt || !profileId) return

    try {
      const profile = await profilesService.getById(profileId, jwt)
      setUserGoingEvents(profile.goingToEvents || [])
      setUserInterestedEvents(profile.interestedEvents || [])
      setUserProfile({
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
        phone: profile.phone,
        avatarUrl: profile.avatarUrl,
      })
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [session])

  // Handle optimistic updates from EventCards
  const handleEventUpdate = (
    eventId: string,
    goingEvents: string[],
    interestedEvents: string[],
    wasGoing: boolean,
    wasInterested: boolean
  ) => {
    // Update user arrays
    setUserGoingEvents(goingEvents)
    setUserInterestedEvents(interestedEvents)

    // Calculate attendance changes
    const isNowGoing = goingEvents.includes(eventId)
    const isNowInterested = interestedEvents.includes(eventId)

    const goingDelta = isNowGoing && !wasGoing ? 1 : !isNowGoing && wasGoing ? -1 : 0
    const interestedDelta = isNowInterested && !wasInterested ? 1 : !isNowInterested && wasInterested ? -1 : 0

    // Update event attendance counts
    if (goingDelta !== 0 || interestedDelta !== 0) {
      updateEventAttendance(eventId, goingDelta, interestedDelta)
    }
  }

  // Smooth scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const totalScroll = docHeight - windowHeight
      const progress = Math.min((scrolled / totalScroll) * 100, 100)
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Filter events
  const getFilteredEvents = () => {
    let filtered = events as Event[]

    // Quick filters
    if (quickFilter) {
      const now = new Date()
      const thisWeekend = new Date()
      thisWeekend.setDate(now.getDate() + (6 - now.getDay())) // Next Saturday

      switch (quickFilter) {
        case "This Weekend":
          filtered = filtered.filter((event) => {
            const eventDate = event.dateRange?.startAt ? new Date(event.dateRange.startAt) : null
            if (!eventDate) return false
            const daysDiff = Math.floor((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            return daysDiff >= 0 && daysDiff <= 7 && (eventDate.getDay() === 0 || eventDate.getDay() === 6)
          })
          break
        case "Free Events":
          // Assuming free events have no access password or specific indicators
          filtered = filtered.filter((event) => !event.access?.password)
          break
        case "Popular":
          // Sort by total attendance and take top events
          filtered = filtered
            .filter((event) => (event.attendance?.going || 0) + (event.attendance?.interested || 0) > 0)
            .sort((a, b) => {
              const aTotal = (a.attendance?.going || 0) + (a.attendance?.interested || 0)
              const bTotal = (b.attendance?.going || 0) + (b.attendance?.interested || 0)
              return bTotal - aTotal
            })
          break
      }
    }

    if (selectedMood) {
      const mood = MOOD_OPTIONS.find((m) => m.id === selectedMood)
      if (mood) {
        filtered = filtered.filter((event) => {
          return event.themes?.some((theme) => mood.themes.includes(theme))
        })
      }
    }

    if (isSearchMode && searchQuery.trim()) {
      filtered = filtered.filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    return filtered
  }

  const displayEvents = getFilteredEvents()
  const upcomingCount = (events as Event[]).filter((e) => {
    const date = e.dateRange?.startAt ? new Date(e.dateRange.startAt) : null
    return date && date > new Date()
  }).length

  // Calculate real statistics from events
  const totalAttendees = (events as Event[]).reduce((sum, event) => {
    return sum + (event.attendance?.going || 0) + (event.attendance?.interested || 0)
  }, 0)

  const uniqueThemes = new Set((events as Event[]).flatMap((event) => event.themes || []).filter(Boolean)).size

  const thisWeekEvents = (events as Event[]).filter((e) => {
    const date = e.dateRange?.startAt ? new Date(e.dateRange.startAt) : null
    if (!date) return false
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return date >= now && date <= weekFromNow
  }).length

  return (
    <Box minH="100vh" bg="bg.canvas" position="relative">
      <Navigation />

      {/* Scroll Progress Indicator */}
      <Box
        position="fixed"
        top={0}
        left={0}
        h="3px"
        w={`${scrollProgress}%`}
        bg="brand.red.500"
        zIndex={1000}
        transition="width 0.1s ease-out"
        boxShadow="0 0 10px rgba(230, 57, 70, 0.5)"
      />

      {/* Hero Section with Enhanced Visuals - Compact in search mode */}
      <Box
        position="relative"
        overflow="hidden"
        bg="brand.red.500"
        pt={{ base: 20, md: 24 }}
        pb={isSearchMode ? { base: 8, md: 12 } : { base: 32, md: 40 }}
        transition="all 0.5s ease-in-out"
      >
        {/* Animated Gradient Background */}
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-br, brand.red.600, brand.red.500, brand.red.700)"
          opacity={0.95}
        />

        {/* Dotted Pattern Overlay */}
        <Box
          position="absolute"
          inset={0}
          opacity={0.1}
          backgroundImage="radial-gradient(circle, white 1px, transparent 1px)"
          backgroundSize="24px 24px"
        />

        {/* Floating Gradient Orbs - More Visible */}
        <Box position="absolute" inset={0} pointerEvents="none" overflow="hidden">
          <Box
            position="absolute"
            top="-10%"
            left="-5%"
            w={{ base: "300px", md: "500px" }}
            h={{ base: "300px", md: "500px" }}
            borderRadius="full"
            bgGradient="radial(white, transparent)"
            opacity={0.15}
            filter="blur(40px)"
            animation="float 20s ease-in-out infinite"
          />
          <Box
            position="absolute"
            bottom="-10%"
            right="-5%"
            w={{ base: "400px", md: "600px" }}
            h={{ base: "400px", md: "600px" }}
            borderRadius="full"
            bgGradient="radial(brand.red.800, transparent)"
            opacity={0.2}
            filter="blur(60px)"
            animation="float 25s ease-in-out infinite reverse"
          />
        </Box>

        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack gap={6} align="center" textAlign="center">
            {/* Stats Row - Hidden in search mode */}
            {!isSearchMode && (
              <HStack
                gap={{ base: 3, md: 6 }}
                flexWrap="wrap"
                justify="center"
                bg="whiteAlpha.100"
                backdropFilter="blur(10px)"
                px={{ base: 4, md: 6 }}
                py={3}
                borderRadius="full"
                borderWidth="1px"
                borderColor="whiteAlpha.200"
              >
                <HStack gap={2}>
                  <Icon as={FiActivity} boxSize={4} color="white" />
                  <Text fontSize="sm" fontWeight="bold" color="white">
                    {upcomingCount} {upcomingCount === 1 ? "Event" : "Events"} Coming Up
                  </Text>
                </HStack>
                <Box w="1px" h={4} bg="whiteAlpha.300" display={{ base: "none", md: "block" }} />
                <HStack gap={2}>
                  <Icon as={FiUsers} boxSize={4} color="white" />
                  <Text fontSize="sm" fontWeight="bold" color="white">
                    {totalAttendees}+ {totalAttendees === 1 ? "Attendee" : "Attendees"}
                  </Text>
                </HStack>
                <Box w="1px" h={4} bg="whiteAlpha.300" display={{ base: "none", md: "block" }} />
                <HStack gap={2}>
                  <Icon as={FiStar} boxSize={4} color="white" />
                  <Text fontSize="sm" fontWeight="bold" color="white">
                    {uniqueThemes} {uniqueThemes === 1 ? "Category" : "Categories"}
                  </Text>
                </HStack>
                {thisWeekEvents > 0 && (
                  <>
                    <Box w="1px" h={4} bg="whiteAlpha.300" display={{ base: "none", lg: "block" }} />
                    <HStack gap={2} display={{ base: "none", lg: "flex" }}>
                      <Icon as={FiHeart} boxSize={4} color="white" />
                      <Text fontSize="sm" fontWeight="bold" color="white">
                        {thisWeekEvents} This Week
                      </Text>
                    </HStack>
                  </>
                )}
              </HStack>
            )}

            {/* Main Heading - Hidden in search mode */}
            {!isSearchMode && (
              <VStack gap={4} color="white">
                <Heading
                  fontSize={{ base: "5xl", md: "7xl", lg: "8xl" }}
                  fontWeight="black"
                  lineHeight="0.95"
                  letterSpacing="tight"
                  textShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
                >
                  Your next
                  <br />
                  <Text as="span" position="relative" display="inline-block">
                    adventure
                    <Box
                      position="absolute"
                      bottom={-2}
                      left={0}
                      right={0}
                      h="6px"
                      bg="white"
                      opacity={0.3}
                      borderRadius="full"
                    />
                  </Text>
                </Heading>

                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color="whiteAlpha.900"
                  maxW="2xl"
                  fontWeight="medium"
                  lineHeight="tall"
                >
                  Discover events that match your vibe. Connect with people.
                  <br />
                  Create unforgettable memories.
                </Text>
              </VStack>
            )}

            {/* Search Bar with Enhanced Glassmorphism */}
            <Box w="full" maxW="2xl">
              <Box
                position="relative"
                bg="white"
                borderRadius="2xl"
                p={1}
                shadow="0 20px 60px rgba(0, 0, 0, 0.3)"
                _hover={{
                  shadow: "0 25px 70px rgba(0, 0, 0, 0.35)",
                }}
                transition="all 0.3s"
              >
                <HStack gap={2} bg="white" borderRadius="xl" px={2}>
                  <Icon as={FiSearch} boxSize={5} color="brand.red.500" ml={2} />
                  <Input
                    placeholder="Search for events, activities, experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        setIsSearchMode(true)
                      }
                    }}
                    size="lg"
                    border="none"
                    color="gray.800"
                    _placeholder={{ color: "gray.500" }}
                    _focus={{ outline: "none", boxShadow: "none" }}
                    fontSize="md"
                    fontWeight="medium"
                  />
                  {searchQuery && (
                    <Box
                      as="button"
                      onClick={() => {
                        setSearchQuery("")
                        setIsSearchMode(false)
                      }}
                      px={3}
                      py={2}
                      color="gray.500"
                      borderRadius="lg"
                      fontSize="sm"
                      fontWeight="medium"
                      _hover={{ bg: "gray.100", color: "gray.700" }}
                      transition="all 0.2s"
                    >
                      Clear
                    </Box>
                  )}
                  <Box
                    as="button"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        setIsSearchMode(true)
                      }
                    }}
                    px={6}
                    py={3}
                    bg="brand.red.500"
                    color="white"
                    borderRadius="xl"
                    fontWeight="bold"
                    fontSize="sm"
                    _hover={{ bg: "brand.red.600" }}
                    transition="all 0.2s"
                  >
                    Search
                  </Box>
                </HStack>
              </Box>
            </Box>

            {/* Quick Action Pills - Hidden in search mode */}
            {!isSearchMode && (
              <HStack gap={3} flexWrap="wrap" justify="center">
                {["This Weekend", "Free Events", "Near You", "Popular"].map((label) => (
                  <Box
                    key={label}
                    as="button"
                    onClick={() => {
                      if (quickFilter === label) {
                        setQuickFilter(null)
                      } else {
                        setQuickFilter(label)
                      }
                    }}
                    px={4}
                    py={2}
                    bg={quickFilter === label ? "white" : "whiteAlpha.200"}
                    backdropFilter="blur(10px)"
                    color={quickFilter === label ? "brand.red.500" : "white"}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight={quickFilter === label ? "bold" : "semibold"}
                    borderWidth="1px"
                    borderColor={quickFilter === label ? "white" : "whiteAlpha.300"}
                    _hover={{
                      bg: "white",
                      color: "brand.red.500",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                  >
                    {label}
                  </Box>
                ))}
              </HStack>
            )}
          </VStack>
        </Container>

        {/* Wave Divider - Smooth Curve - Hidden in search mode */}
        {!isSearchMode && (
          <Box position="absolute" bottom={-1} left={0} right={0} pointerEvents="none">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", height: "auto", display: "block" }}
            >
              <path
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                fill="var(--chakra-colors-bg-canvas)"
              />
            </svg>
          </Box>
        )}
      </Box>

      {/* Search Results Section - Only show in search mode */}
      {isSearchMode && (
        <Box bg="bg.canvas" py={8}>
          <Container maxW="container.xl">
            <VStack align="stretch" gap={6} animation="fadeInUp 0.3s ease-out">
              {/* Search Results Header */}
              <HStack
                justify="space-between"
                align="center"
                p={6}
                bg={{ base: "white", _dark: "gray.800" }}
                borderRadius="2xl"
                borderWidth="2px"
                borderColor={{ base: "blue.200", _dark: "blue.800" }}
                shadow="sm"
              >
                <HStack gap={4}>
                  <Box p={3} bg="blue.500" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                    <Icon as={FiSearch} boxSize={6} color="white" />
                  </Box>
                  <VStack align="start" gap={1}>
                    <Heading fontSize="2xl" fontWeight="black">
                      Search Results
                    </Heading>
                    <Text fontSize="sm" color="fg.muted">
                      {displayEvents.length} {displayEvents.length === 1 ? "event" : "events"} found for "{searchQuery}"
                    </Text>
                  </VStack>
                </HStack>
                <Box
                  as="button"
                  onClick={() => {
                    setIsSearchMode(false)
                    setSearchQuery("")
                  }}
                  px={6}
                  py={3}
                  bg="brand.red.500"
                  color="white"
                  borderRadius="xl"
                  fontWeight="bold"
                  fontSize="sm"
                  _hover={{ bg: "brand.red.600", transform: "translateY(-2px)", shadow: "md" }}
                  transition="all 0.2s"
                  shadow="sm"
                >
                  ← Back to Browse
                </Box>
              </HStack>

              {/* Search Results Grid */}
              {displayEvents.length === 0 ? (
                <Box
                  p={16}
                  bg={{ base: "white", _dark: "gray.800" }}
                  borderRadius="2xl"
                  borderWidth="2px"
                  borderColor={{ base: "gray.200", _dark: "gray.700" }}
                  borderStyle="dashed"
                  textAlign="center"
                >
                  <EmptyState
                    icon={FiSearch}
                    title="No events found"
                    description={`No events match "${searchQuery}". Try different keywords or browse by mood.`}
                  />
                </Box>
              ) : (
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                  {displayEvents.map((event, index) => (
                    <Box
                      key={event.id}
                      id={`event-${event.id}`}
                      opacity={0}
                      animation={`fadeInUp 0.5s ease-out ${index * 0.08}s forwards`}
                      scrollMarginTop="100px"
                    >
                      <EventCardNew
                        event={event}
                        variant="detailed"
                        isUserGoing={event.id ? userGoingEvents.includes(event.id) : false}
                        isUserInterested={event.id ? userInterestedEvents.includes(event.id) : false}
                        onUpdate={handleEventUpdate}
                      />
                    </Box>
                  ))}
                </Grid>
              )}
            </VStack>
          </Container>
        </Box>
      )}

      {/* Browse Mode Content - Hidden in search mode */}
      {!isSearchMode && (
        <Container maxW="container.xl" py={8} position="relative" zIndex={10} mt={-16}>
          {/* Mood Filter - Grid Cards */}
          <Box mb={12}>
            <Grid
              templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(5, 1fr)" }}
              gap={4}
              animation="fadeInUp 0.5s ease-out 0.2s backwards"
            >
              {MOOD_OPTIONS.map((mood, index) => {
                const isActive = selectedMood === mood.id
                return (
                  <Box
                    key={mood.id}
                    as="button"
                    onClick={() => setSelectedMood(isActive ? null : mood.id)}
                    p={6}
                    bg={{ base: "white", _dark: "gray.800" }}
                    borderRadius="2xl"
                    borderWidth={isActive ? "2px" : "1px"}
                    borderColor={isActive ? "brand.red.500" : { base: "gray.200", _dark: "gray.700" }}
                    textAlign="center"
                    transition="all 0.3s"
                    shadow={isActive ? "lg" : "none"}
                    _hover={{
                      borderColor: "brand.red.500",
                      shadow: "md",
                    }}
                    animation={`fadeInUp 0.5s ease-out ${0.1 + index * 0.1}s backwards`}
                  >
                    <VStack gap={3}>
                      <Box
                        p={4}
                        bg={{ base: "brand.red.50", _dark: "brand.red.900/20" }}
                        borderRadius="xl"
                        color="brand.red.500"
                      >
                        <Icon as={mood.icon} boxSize={8} />
                      </Box>
                      <VStack gap={0.5}>
                        <Text fontSize="md" fontWeight="bold" color="fg.default">
                          {mood.label}
                        </Text>
                        <Text fontSize="sm" color="fg.muted">
                          {mood.subtitle}
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
                )
              })}
            </Grid>
          </Box>

          {/* Trending Events - Show when no filter active and not in search mode */}
          {!selectedMood && !searchQuery && !isSearchMode && displayEvents.length > 0 && (
            <Box mb={10}>
              <HStack justify="space-between" align="center" mb={5}>
                <HStack gap={3}>
                  <Box p={2} bg="brand.red.500" borderRadius="lg">
                    <Icon as={FiActivity} boxSize={5} color="white" />
                  </Box>
                  <VStack align="start" gap={0}>
                    <Heading fontSize="2xl" fontWeight="bold">
                      Trending Now
                    </Heading>
                    <Text fontSize="sm" color="fg.muted">
                      Most popular events this week
                    </Text>
                  </VStack>
                </HStack>
              </HStack>

              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5}>
                {displayEvents.slice(0, 2).map((event, index) => (
                  <Box
                    key={event.id}
                    position="relative"
                    borderRadius="2xl"
                    overflow="hidden"
                    bg={{ base: "white", _dark: "gray.800" }}
                    borderWidth="1px"
                    borderColor={{ base: "gray.200", _dark: "gray.700" }}
                    transition="all 0.3s"
                    _hover={{
                      transform: "translateY(-4px)",
                      shadow: { base: "xl", _dark: "0 12px 40px rgba(0, 0, 0, 0.4)" },
                      borderColor: "brand.red.500",
                    }}
                    animation={`fadeInUp 0.5s ease-out ${index * 0.1}s backwards`}
                  >
                    {/* Trending badge */}
                    <Box position="absolute" top={4} left={4} zIndex={2}>
                      <HStack
                        gap={1.5}
                        px={3}
                        py={1.5}
                        bg="brand.red.500"
                        color="white"
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="bold"
                        shadow="lg"
                      >
                        <Icon as={FiActivity} boxSize={3} />
                        <Text>Trending #{index + 1}</Text>
                      </HStack>
                    </Box>
                    <EventCardNew
                      event={event}
                      variant="detailed"
                      isUserGoing={event.id ? userGoingEvents.includes(event.id) : false}
                      isUserInterested={event.id ? userInterestedEvents.includes(event.id) : false}
                      onUpdate={handleEventUpdate}
                      userGoingEvents={userGoingEvents}
                      userInterestedEvents={userInterestedEvents}
                      userProfile={userProfile || undefined}
                    />
                  </Box>
                ))}
              </Grid>
            </Box>
          )}

          {/* Results Section */}
          {!loading && displayEvents.length > 0 && (selectedMood || searchQuery) && (
            <Box mb={6}>
              <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
                <VStack align="start" gap={1}>
                  <Heading fontSize="2xl" fontWeight="bold">
                    {selectedMood
                      ? `${MOOD_OPTIONS.find((m) => m.id === selectedMood)?.label} Events`
                      : searchQuery
                      ? "Search Results"
                      : "All Events"}
                  </Heading>
                  <Text fontSize="sm" color="fg.muted">
                    {displayEvents.length} {displayEvents.length === 1 ? "event" : "events"} match your preferences
                  </Text>
                </VStack>

                {/* Sort Options */}
                <HStack gap={2}>
                  <Text fontSize="sm" color="fg.muted" fontWeight="medium">
                    Sort by:
                  </Text>
                  {["Recommended", "Date", "Popular"].map((option) => (
                    <Box
                      key={option}
                      as="button"
                      px={3}
                      py={1.5}
                      bg={option === "Recommended" ? "brand.red.500" : { base: "gray.50", _dark: "gray.800" }}
                      color={option === "Recommended" ? "white" : "fg.default"}
                      borderRadius="lg"
                      fontSize="sm"
                      fontWeight="semibold"
                      borderWidth="1px"
                      borderColor={option === "Recommended" ? "brand.red.500" : { base: "gray.200", _dark: "gray.700" }}
                      _hover={{
                        bg: option === "Recommended" ? "brand.red.600" : "brand.red.50",
                        borderColor: "brand.red.500",
                      }}
                      transition="all 0.2s"
                    >
                      {option}
                    </Box>
                  ))}
                </HStack>
              </HStack>
            </Box>
          )}

          {/* Events Grid */}
          {loading ? (
            <EventCardSkeletonGrid count={6} />
          ) : displayEvents.length === 0 ? (
            <Box
              ref={scrollContainerRef}
              p={16}
              bg={{ base: "white", _dark: "gray.800" }}
              borderRadius="2xl"
              borderWidth="2px"
              borderColor={{ base: "gray.200", _dark: "gray.700" }}
              borderStyle="dashed"
              textAlign="center"
            >
              <EmptyState
                icon={selectedMood ? FiHeart : FiSearch}
                title={
                  selectedMood
                    ? `No ${MOOD_OPTIONS.find((m) => m.id === selectedMood)?.label.toLowerCase()} events found`
                    : searchQuery
                    ? "No events found"
                    : "No events available"
                }
                description={
                  selectedMood
                    ? "Try selecting a different mood or clear your filter to explore all events."
                    : searchQuery
                    ? `No events match "${searchQuery}". Try different keywords or browse by mood.`
                    : "Check back soon for exciting new events!"
                }
              />
              {(selectedMood || searchQuery) && (
                <HStack gap={3} mt={4} justify="center" flexWrap="wrap">
                  {selectedMood && (
                    <Box
                      as="button"
                      onClick={() => setSelectedMood(null)}
                      px={6}
                      py={3}
                      bg="brand.red.500"
                      color="white"
                      borderRadius="xl"
                      fontWeight="bold"
                      _hover={{ bg: "brand.red.600" }}
                      transition="all 0.2s"
                    >
                      Clear Mood Filter
                    </Box>
                  )}
                  {searchQuery && (
                    <Box
                      as="button"
                      onClick={() => setSearchQuery("")}
                      px={6}
                      py={3}
                      bg={{ base: "gray.100", _dark: "gray.700" }}
                      color="fg.default"
                      borderRadius="xl"
                      fontWeight="bold"
                      _hover={{ bg: { base: "gray.200", _dark: "gray.600" } }}
                      transition="all 0.2s"
                    >
                      Clear Search
                    </Box>
                  )}
                </HStack>
              )}
            </Box>
          ) : (
            <Grid
              ref={scrollContainerRef}
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
              gap={6}
              p={1}
            >
              {displayEvents
                .slice(selectedMood || searchQuery ? 0 : 2) // Skip first 2 if showing trending
                .map((event, index) => (
                  <Box
                    key={event.id}
                    id={`event-${event.id}`}
                    opacity={0}
                    animation={`fadeInUp 0.5s ease-out ${index * 0.08}s forwards`}
                    transition="all 0.3s"
                    _hover={{ transform: "translateY(-2px)" }}
                    scrollMarginTop="100px"
                  >
                    <EventCardNew
                      event={event}
                      variant="detailed"
                      isUserGoing={event.id ? userGoingEvents.includes(event.id) : false}
                      isUserInterested={event.id ? userInterestedEvents.includes(event.id) : false}
                      onUpdate={handleEventUpdate}
                      userGoingEvents={userGoingEvents}
                      userInterestedEvents={userInterestedEvents}
                      userProfile={userProfile || undefined}
                    />
                  </Box>
                ))}
            </Grid>
          )}
        </Container>
      )}

      {/* Floating Back to Top */}
      {scrollProgress > 20 && (
        <VStack position="fixed" bottom={8} right={8} zIndex={100} gap={3} animation="fadeIn 0.3s ease-out">
          {/* Scroll Progress Ring */}
          <Box position="relative">
            <svg width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.1" />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.1s ease-out", color: "var(--chakra-colors-brand-red-500)" }}
              />
            </svg>
            <Box
              as="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              p={3}
              bg="brand.red.500"
              borderRadius="full"
              color="white"
              shadow={{ base: "xl", _dark: "0 10px 40px rgba(230, 57, 70, 0.5)" }}
              _hover={{
                bg: "brand.red.600",
                transform: "translate(-50%, -50%) scale(1.1)",
                shadow: { base: "2xl", _dark: "0 20px 60px rgba(230, 57, 70, 0.6)" },
              }}
              transition="all 0.3s"
            >
              <Icon as={FiCompass} boxSize={5} />
            </Box>
          </Box>
        </VStack>
      )}

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(20px, -20px) scale(1.05);
          }
          66% {
            transform: translate(-15px, 15px) scale(0.95);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </Box>
  )
}
