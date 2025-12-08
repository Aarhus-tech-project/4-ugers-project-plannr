"use client"

// Shared components
import { Navigation } from "@/shared/components/layout/Navigation"
import { Button } from "@/shared/components/ui/Button"
import { Card } from "@/shared/components/ui/Card"
import { ThemeSelector } from "@/shared/components/ui/ThemeSelector"
import type { EventThemeName } from "@/shared/types"

// Feature components
import {
  AIFeedbackPanel,
  AtmosphereSection,
  DetailsSection,
  ErrorDisplay,
  LivePreview,
  ProgressHeader,
  ShowcaseSection,
  SparkSection,
  StageSection,
  TimelineSection,
} from "@/features/event-creation/components"

// Feature hooks
import { useAIFeedback, useCompletionMetrics } from "@/features/event-creation/hooks"

// Feature constants
import { STORY_SECTIONS } from "@/features/event-creation/constants"

// Chakra UI
import { Box, Container, Flex, Grid, Heading, HStack, Icon, Spinner, Text, VStack } from "@chakra-ui/react"

// Next.js & React
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"

// Icons
import { FiAlertCircle, FiArrowLeft, FiSave } from "react-icons/fi"

// Services
import { eventsService } from "@/lib/api/services/events"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditEventPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [fetchingEvent, setFetchingEvent] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [prevCompletionPercent, setPrevCompletionPercent] = useState(0)
  const [showProgressBoost, setShowProgressBoost] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [venue, setVenue] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedThemes, setSelectedThemes] = useState<EventThemeName[]>([])
  const [imageUrl, setImageUrl] = useState("")
  const [sections, setSections] = useState<Array<any>>([])
  const [ageRestriction, setAgeRestriction] = useState<number | null>(null)

  // Address autocomplete state
  const [addressQuery, setAddressQuery] = useState("")
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  // Debounced address search
  useEffect(() => {
    if (!addressQuery || addressQuery.length < 3) {
      setAddressSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            addressQuery
          )}&format=json&addressdetails=1&limit=5`
        )
        const data = await response.json()
        setAddressSuggestions(data)
      } catch (error) {
        console.error("Address search failed:", error)
      } finally {
        setIsLoadingSuggestions(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [addressQuery])

  // Fetch event data and populate form
  useEffect(() => {
    async function fetchEvent() {
      if (!session?.jwt) {
        setFetchingEvent(false)
        return
      }

      try {
        const eventData = await eventsService.getById(id, session.jwt)

        // Check if user is the creator
        if (eventData.creatorId !== session.profileId) {
          setError("You don't have permission to edit this event")
          setFetchingEvent(false)
          return
        }

        // Populate form fields
        setTitle(eventData.title || "")
        setDescription(eventData.description || "")

        // Parse dates
        if (eventData.dateRange?.startAt) {
          const startDateTime = new Date(eventData.dateRange.startAt)
          setStartDate(startDateTime.toISOString().split("T")[0])
          setStartTime(startDateTime.toTimeString().slice(0, 5))
        }

        if (eventData.dateRange?.endAt) {
          const endDateTime = new Date(eventData.dateRange.endAt)
          setEndDate(endDateTime.toISOString().split("T")[0])
          setEndTime(endDateTime.toTimeString().slice(0, 5))
        }

        // Location
        setVenue(eventData.location?.venue || "")
        setAddress(eventData.location?.address || "")
        setCity(eventData.location?.city || "")
        setCountry(eventData.location?.country || "")

        // Themes
        setSelectedThemes((eventData.themes as EventThemeName[]) || [])

        // Images
        if (eventData.imageUrl) {
          setImagePreviews([eventData.imageUrl])
        }

        // Sections and age restriction
        setSections(eventData.sections || [])
        setAgeRestriction(eventData.ageRestriction || null)

        setFetchingEvent(false)
      } catch (err: any) {
        console.error("Failed to fetch event:", err)
        setError(err.message || "Failed to load event")
        setFetchingEvent(false)
      }
    }

    fetchEvent()
  }, [id, session])

  const toggleTheme = (theme: EventThemeName) => {
    if (selectedThemes.includes(theme)) {
      setSelectedThemes(selectedThemes.filter((t) => t !== theme))
    } else if (selectedThemes.length < 4) {
      setSelectedThemes([...selectedThemes, theme])
    }
  }

  const addImageUrl = () => {
    if (imageUrl.trim() && imagePreviews.length < 5) {
      setImagePreviews([...imagePreviews, imageUrl.trim()])
      setImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("Please enter an event title")
      return
    }

    if (!startDate || !startTime) {
      setError("Please select a start date and time")
      return
    }

    if (!address.trim() || !city.trim()) {
      setError("Please enter a complete address")
      return
    }

    if (selectedThemes.length === 0) {
      setError("Please select at least one theme")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const jwt = session?.jwt

      if (!jwt) {
        setError("Please sign in to update the event")
        setLoading(false)
        return
      }

      const startAt = new Date(`${startDate}T${startTime}`)
      const endAt = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null

      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        startAt,
        endAt,
        location: {
          address: address.trim(),
          city: city.trim(),
          country: country.trim(),
          venue: venue.trim() || undefined,
          latitude: null,
          longitude: null,
        },
        themes: selectedThemes,
        images: imagePreviews.map((src) => ({ src, likes: 0 })),
        sections: sections.length > 0 ? sections : undefined,
        ageRestriction: ageRestriction || undefined,
      }

      await eventsService.update(id, payload, jwt)
      router.push(`/events/${id}`)
    } catch (err: any) {
      console.error("Failed to update event:", err)
      setError(err.message || "Failed to update event")
    } finally {
      setLoading(false)
    }
  }

  // Calculate completion metrics and AI feedback using custom hooks
  const {
    requiredFieldsCount,
    requiredFieldsTotal,
    requiredComplete,
    highImpactCount,
    highImpactTotal,
    completionPercent,
    completedFieldsCount,
    totalFieldsCount,
    qualityScore,
    qualityPoints,
  } = useCompletionMetrics({
    title,
    description,
    startDate,
    startTime,
    endDate,
    endTime,
    address,
    city,
    venue,
    selectedThemes,
    imagePreviews,
    sections,
    ageRestriction,
  })

  const { prioritizedFeedback } = useAIFeedback({
    title,
    description,
    startDate,
    startTime,
    endDate,
    endTime,
    address,
    city,
    venue,
    selectedThemes,
    imagePreviews,
    completionPercent,
  })

  // Track progress changes and trigger visual feedback
  useEffect(() => {
    if (completionPercent > prevCompletionPercent) {
      // Progress increased - trigger celebration!
      setShowProgressBoost(true)
      setTimeout(() => setShowProgressBoost(false), 800)
    }
    setPrevCompletionPercent(completionPercent)
  }, [completionPercent, prevCompletionPercent])

  const currentSectionData = STORY_SECTIONS[currentSection]

  const goToNextSection = () => {
    if (currentSection < STORY_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const goToPrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  // Loading states
  if (!session) {
    return (
      <Box minH="100vh" bg="bg.canvas">
        <Navigation />
        <Container maxW="container.md" py={20}>
          <Card p={8} textAlign="center">
            <Icon as={FiAlertCircle} boxSize={16} color="state.error.fg" mb={4} />
            <Heading fontSize="2xl" mb={2}>
              Authentication Required
            </Heading>
            <Text color="fg.muted" mb={6}>
              Please sign in to edit events.
            </Text>
            <HStack justify="center">
              <Button onClick={() => router.push("/login")}>Sign In</Button>
            </HStack>
          </Card>
        </Container>
      </Box>
    )
  }

  if (fetchingEvent) {
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

  if (error) {
    return (
      <Box minH="100vh" bg="bg.canvas">
        <Navigation />
        <Container maxW="container.md" py={20}>
          <Card p={8} textAlign="center">
            <Icon as={FiAlertCircle} boxSize={16} color="state.error.fg" mb={4} />
            <Heading fontSize="2xl" mb={2}>
              {error}
            </Heading>
            <HStack justify="center" mt={4}>
              <Button onClick={() => router.push("/events")}>Back to Events</Button>
            </HStack>
          </Card>
        </Container>
      </Box>
    )
  }

  return (
    <Box
      minH="100vh"
      bg="bg.canvas"
      css={
        {
          "--section-color": currentSectionData.primaryColor,
          "--section-accent": currentSectionData.accentColor,
          "--section-icon-color": currentSectionData.iconColor,
        } as any
      }
    >
      <Navigation />

      {/* Back Button */}
      <Container maxW="container.xl" py={4}>
        <Button variant="ghost" onClick={() => router.push(`/events/${id}`)}>
          <HStack gap={2}>
            <Icon as={FiArrowLeft} />
            <Text>Back to Event</Text>
          </HStack>
        </Button>
      </Container>

      {/* Progress Header */}
      <ProgressHeader
        title={title}
        currentSectionTitle={currentSectionData.title}
        requiredComplete={requiredComplete}
        requiredFieldsCount={requiredFieldsCount}
        requiredFieldsTotal={requiredFieldsTotal}
        highImpactCount={highImpactCount}
        highImpactTotal={highImpactTotal}
        qualityScore={qualityScore}
        qualityPoints={qualityPoints}
        completionPercent={completionPercent}
        completedFieldsCount={completedFieldsCount}
        totalFieldsCount={totalFieldsCount}
        prevCompletionPercent={prevCompletionPercent}
        showProgressBoost={showProgressBoost}
      />

      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 400px" }} gap={8} alignItems="start">
          {/* Main Content - Story Sections */}
          <Box>
            {/* Section Header */}
            <Box
              mb={8}
              p={8}
              borderRadius="2xl"
              background={currentSectionData.gradient}
              color={{ base: "white", _dark: "gray.100" }}
              position="relative"
              overflow="hidden"
              shadow="lg"
            >
              <Box position="absolute" top={4} right={4} opacity={{ base: 0.2, _dark: 0.15 }}>
                <Icon as={currentSectionData.icon} boxSize={24} />
              </Box>
              <VStack align="start" gap={2} position="relative" zIndex={1}>
                <HStack gap={3}>
                  <Box p={2} bg={{ base: "whiteAlpha.300", _dark: "whiteAlpha.200" }} borderRadius="lg">
                    <Icon as={currentSectionData.icon} boxSize={6} />
                  </Box>
                  <Heading fontSize="3xl" fontWeight="bold">
                    {currentSectionData.title}
                  </Heading>
                </HStack>
                <Text fontSize="lg" opacity={{ base: 0.9, _dark: 0.85 }}>
                  {currentSectionData.subtitle}
                </Text>
              </VStack>

              {/* Section Progress Dots */}
              <HStack mt={6} gap={2}>
                {STORY_SECTIONS.map((section, idx) => {
                  const isCurrent = idx === currentSection
                  return (
                    <Box
                      key={section.id}
                      h="2"
                      flex={1}
                      bg={
                        isCurrent
                          ? { base: "white", _dark: "whiteAlpha.700" }
                          : { base: "whiteAlpha.400", _dark: "whiteAlpha.300" }
                      }
                      borderRadius="full"
                      transition="all 0.3s"
                      cursor="pointer"
                      onClick={() => setCurrentSection(idx)}
                      _hover={{
                        bg: isCurrent
                          ? { base: "white", _dark: "whiteAlpha.800" }
                          : { base: "whiteAlpha.600", _dark: "whiteAlpha.400" },
                      }}
                    />
                  )
                })}
              </HStack>
            </Box>

            {/* Section Content */}
            <Card
              p={8}
              bg={currentSectionData.bgLight}
              borderWidth="2px"
              borderColor={currentSectionData.borderColor}
              transition="all 0.3s ease"
              css={
                {
                  "& input, & textarea": {
                    borderColor: `${currentSectionData.borderColor} !important`,
                    transition: "all 0.2s ease",
                  },
                  "& input:focus, & textarea:focus": {
                    borderColor: `${currentSectionData.iconColor} !important`,
                    boxShadow: `0 0 0 1px ${currentSectionData.iconColor}`,
                  },
                  "& button": {
                    borderColor: `${currentSectionData.borderColor} !important`,
                  },
                } as any
              }
            >
              <VStack align="stretch" gap={6}>
                {/* THE SPARK */}
                {currentSection === 0 && (
                  <SparkSection sectionData={currentSectionData} title={title} setTitle={setTitle} />
                )}

                {/* THE STAGE */}
                {currentSection === 1 && (
                  <StageSection
                    sectionData={currentSectionData}
                    addressQuery={addressQuery}
                    setAddressQuery={setAddressQuery}
                    address={address}
                    setAddress={setAddress}
                    showSuggestions={showSuggestions}
                    setShowSuggestions={setShowSuggestions}
                    addressSuggestions={addressSuggestions}
                    isLoadingSuggestions={isLoadingSuggestions}
                    city={city}
                    setCity={setCity}
                    _country={country}
                    setCountry={setCountry}
                    venue={venue}
                    setVenue={setVenue}
                  />
                )}

                {/* THE ATMOSPHERE */}
                {currentSection === 2 && (
                  <AtmosphereSection
                    sectionData={currentSectionData}
                    selectedThemes={selectedThemes}
                    onToggleTheme={toggleTheme}
                    ThemeSelector={ThemeSelector}
                    description={description}
                    setDescription={setDescription}
                  />
                )}

                {/* THE TIMELINE */}
                {currentSection === 3 && (
                  <TimelineSection
                    sectionData={currentSectionData}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    startTime={startTime}
                    setStartTime={setStartTime}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    endTime={endTime}
                    setEndTime={setEndTime}
                  />
                )}

                {/* THE SHOWCASE */}
                {currentSection === 4 && (
                  <ShowcaseSection
                    sectionData={currentSectionData}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    imagePreviews={imagePreviews}
                    addImageUrl={addImageUrl}
                    removeImage={removeImage}
                  />
                )}

                {/* THE DETAILS - Sections Builder */}
                {currentSection === 5 && (
                  <DetailsSection
                    sectionData={currentSectionData}
                    sections={sections}
                    setSections={setSections}
                    ageRestriction={ageRestriction}
                    setAgeRestriction={setAgeRestriction}
                  />
                )}

                {/* Navigation */}
                <Flex justify="space-between" mt={8} pt={6} borderTopWidth="1px" borderColor="border.default">
                  <Button variant="secondary" onClick={goToPrevSection} disabled={currentSection === 0}>
                    Previous
                  </Button>

                  {currentSection < STORY_SECTIONS.length - 1 ? (
                    <Button
                      onClick={goToNextSection}
                      bg={currentSectionData.iconColor}
                      color="white"
                      _hover={{
                        bg: currentSectionData.primaryColor,
                      }}
                      css={
                        {
                          background: `linear-gradient(135deg, ${currentSectionData.primaryColor}, ${currentSectionData.accentColor})`,
                        } as any
                      }
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={!requiredComplete || loading}
                      animation={
                        requiredComplete && completionPercent >= 70 ? "pulse 2s ease-in-out infinite" : undefined
                      }
                    >
                      <HStack gap={2}>
                        <Icon as={FiSave} />
                        <Text>
                          {loading ? "Updating..." : requiredComplete ? "Update Event" : "Complete Required Fields"}
                        </Text>
                      </HStack>
                    </Button>
                  )}
                </Flex>
              </VStack>
            </Card>
          </Box>

          {/* Right Sidebar - Live Preview & AI Feedback */}
          <Box position="sticky" top="120px">
            <VStack align="stretch" gap={4}>
              <LivePreview
                title={title}
                description={description}
                startDate={startDate}
                startTime={startTime}
                address={address}
                city={city}
                venue={venue}
                selectedThemes={selectedThemes}
                imagePreviews={imagePreviews}
              />
              <AIFeedbackPanel prioritizedFeedback={prioritizedFeedback} onSectionClick={setCurrentSection} />
            </VStack>
          </Box>
        </Grid>

        {/* Error Display */}
        {error && <ErrorDisplay error={error} />}
      </Container>
    </Box>
  )
}
