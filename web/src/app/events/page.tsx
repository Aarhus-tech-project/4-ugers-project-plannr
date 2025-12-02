"use client"
import type { Event, EventThemeName } from "@/lib/types"
import { Box, Button, Flex, Heading, Icon, SimpleGrid, Text, useBreakpointValue } from "@chakra-ui/react"
import { EventCard } from "@components/EventCard"
import { FeaturedEventCard } from "@components/FeaturedEventCard"
import { SearchBar } from "@components/SearchBar"
import { TestimonialCard } from "@components/TestimonialCard"
import { ThemeSelector } from "@components/ThemeSelector"
import { useProfileEvents } from "@hooks/useProfileEvents"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FiPlus } from "react-icons/fi"

// Demo featured events (replace with real data as needed)
const featuredEvents: Event[] = [
  {
    id: "1",
    creatorId: "demo",
    title: "Winter Music Fest",
    format: "inperson" as const,
    dateRange: { startAt: new Date("2025-12-10") },
    imageUrl: "/images/demo1.jpg",
    date: "2025-12-10",
    description: "A night of music and fun.",
  },
  {
    id: "2",
    creatorId: "demo",
    title: "Tech Expo",
    format: "inperson" as const,
    dateRange: { startAt: new Date("2025-12-15") },
    imageUrl: "/images/demo2.jpg",
    date: "2025-12-15",
    description: "Explore the latest in tech.",
  },
]
// ThemeSelector now handles theme icons and theme list
// Demo testimonials (replace with real data as needed)
const testimonials: Array<{ name: string; avatarUrl?: string; quote: string }> = [
  {
    name: "Alex Jensen",
    avatarUrl: "/images/avatar1.jpg",
    quote: "Plannr helped me find events I love!",
  },
  {
    name: "Maria Lopez",
    avatarUrl: "/images/avatar2.jpg",
    quote: "The best way to connect with my community.",
  },
]

export default function EventsPage() {
  const router = useRouter()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { events, loading } = useProfileEvents()
  const [search, setSearch] = useState("")
  const [selectedThemes, setSelectedThemes] = useState<EventThemeName[]>([])
  const filteredEvents = (events as Event[]).filter((event) => {
    // Multi-select theme filter
    if (selectedThemes.length > 0 && !(event.themes ?? []).some((theme) => selectedThemes.includes(theme))) return false
    if (!search.trim()) return true
    const query = search.toLowerCase()
    return (
      event.title?.toLowerCase().includes(query) ||
      (Array.isArray(event.sections)
        ? event.sections.some(
            (section) =>
              section.type === "description" &&
              typeof section.content === "string" &&
              section.content.toLowerCase().includes(query)
          )
        : false) ||
      (event.location &&
        Object.values(event.location)
          .filter((v) => typeof v === "string")
          .map((v) => (v as string).toLowerCase())
          .join(" ")
          .includes(query)) ||
      (Array.isArray(event.themes) ? event.themes.some((cat: string) => cat.toLowerCase().includes(query)) : false)
    )
  })
  const isSearching = !!search.trim()
  return (
    <Box minH="100vh" bg="brand.white">
      <Box
        py={isMobile ? 10 : 20}
        px={isMobile ? 4 : 16}
        borderBottomRadius="3xl"
        position="relative"
        bg="rgba(230,57,70,0.12)"
        backdropFilter="blur(16px)"
        overflow="hidden"
      >
        <Flex justify="center" mb={4} position="relative" zIndex={1}>
          <SearchBar value={search} onChange={setSearch} />
        </Flex>
        {!isSearching && (
          <Flex justify="center" mt={4} position="relative" zIndex={1}>
            <ThemeSelector selectedThemes={selectedThemes} onChange={setSelectedThemes} />
          </Flex>
        )}
      </Box>
      <Box py={isMobile ? 6 : 10} px={isMobile ? 2 : 16}>
        <Heading size="md" color="brand.red" mb={4} fontWeight="extrabold">
          {isSearching ? "Filtered Events" : "Your Events"}
        </Heading>
        <SimpleGrid columns={isMobile ? 1 : 2} gap={8}>
          {loading ? (
            <Text color="gray.500" fontSize="lg">
              Loading events…
            </Text>
          ) : filteredEvents.length === 0 ? (
            <Text color="gray.500" fontSize="lg">
              No events found.
            </Text>
          ) : (
            filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </SimpleGrid>
      </Box>
      {!isSearching && (
        <>
          {/* Featured Carousel */}
          <Box py={isMobile ? 6 : 10} px={isMobile ? 2 : 16}>
            <Heading size="md" color="brand.red" mb={4} fontWeight="extrabold">
              Featured Events
            </Heading>
            <Flex gap={6} overflowX="auto" pb={2}>
              {featuredEvents.map((event) => (
                <FeaturedEventCard key={event.id} event={event} />
              ))}
            </Flex>
          </Box>
          {/* Story Highlights */}
          <Box py={isMobile ? 6 : 10} px={isMobile ? 2 : 16}>
            <Heading size="md" color="brand.red" mb={4} fontWeight="extrabold">
              People are talking about…
            </Heading>
            <SimpleGrid columns={isMobile ? 1 : 2} gap={6}>
              {testimonials.map((t, i) => (
                <TestimonialCard key={i} testimonial={t} />
              ))}
            </SimpleGrid>
          </Box>
          {/* Social Engagement & CTA */}
          <Box py={isMobile ? 6 : 10} px={isMobile ? 2 : 16} textAlign="center">
            <Heading size="md" color="brand.red" mb={4} fontWeight="extrabold">
              Ready to create your own event?
            </Heading>
            <Button
              size="lg"
              bg="brand.red"
              color="white"
              borderRadius="xl"
              fontWeight="bold"
              px={8}
              py={6}
              boxShadow="lg"
              _hover={{ bg: "brand.red", opacity: 0.85 }}
              onClick={() => router.push("/events/create")}
            >
              {" "}
              <Icon as={FiPlus} mr={2} /> Create Event{" "}
            </Button>
          </Box>
          <Box my={8} borderBottom="1px solid" borderColor="gray.200" />
          {/* Footer */}
          <Box as="footer" textAlign="center" py={6} color="gray.400" fontSize="sm">
            &copy; {new Date().getFullYear()} Plannr. All rights reserved.
          </Box>
        </>
      )}
    </Box>
  )
}
