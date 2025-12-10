"use client"

import { EventCardNew } from "@/features/profile/components/EventCardNew"
import { Button } from "@/shared/components/ui/Button"
import { Input } from "@/shared/components/ui/Input"
import { LoadingState } from "@/shared/components/ui/States"
import { useRequireAuth } from "@/shared/hooks/useClientRedirect"
import type { Event } from "@/shared/types"
import { Box, Container, Grid, Heading, HStack, Icon, Text, VStack } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { FiArrowRight, FiCalendar, FiSearch, FiZap } from "react-icons/fi"

// Mock featured events for the preview
const mockEvents: Event[] = [
  {
    id: "1",
    creatorId: "demo",
    title: "Tech Meetup Copenhagen",
    format: "inperson" as const,
    dateRange: { startAt: new Date("2025-12-15") },
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    date: "Dec 15, 2025",
    description: "Join local tech enthusiasts for networking and knowledge sharing.",
    themes: ["Tech" as const, "Networking" as const],
    location: { city: "Copenhagen", country: "Denmark", address: "TechHub CPH", venue: "TechHub" },
    attendance: { going: 24, interested: 12 },
  },
  {
    id: "2",
    creatorId: "demo",
    title: "Jazz Night at Tivoli",
    format: "inperson" as const,
    dateRange: { startAt: new Date("2025-12-20") },
    imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800",
    date: "Dec 20, 2025",
    description: "An evening of smooth jazz in the heart of Copenhagen.",
    themes: ["Music" as const, "Art" as const],
    location: { city: "Copenhagen", country: "Denmark", address: "Tivoli Gardens", venue: "Tivoli" },
    attendance: { going: 156, interested: 89 },
  },
  {
    id: "3",
    creatorId: "demo",
    title: "Startup Founders Brunch",
    format: "inperson" as const,
    dateRange: { startAt: new Date("2025-12-22") },
    imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800",
    date: "Dec 22, 2025",
    description: "Connect with fellow founders over brunch and ideas.",
    themes: ["Business" as const, "Networking" as const, "Food" as const],
    location: { city: "Copenhagen", country: "Denmark", address: "Startup Village", venue: "Startup Village" },
    attendance: { going: 18, interested: 34 },
  },
]

export default function LandingPage() {
  const router = useRouter()
  const { session, isLoading } = useRequireAuth()

  // If authenticated, redirect to events feed
  useEffect(() => {
    if (session) {
      router.push("/events")
    }
  }, [session, router])

  if (isLoading) {
    return <LoadingState message="Loading..." />
  }

  // Don't render landing page content if authenticated
  if (session) {
    return null
  }

  return (
    <Box minH="100vh" bg="bg.canvas">
      {/* Navigation */}
      <Box as="nav" bg="bg.surface" borderBottomWidth="1px" borderColor="border.muted">
        <Container maxW="container.xl">
          <HStack justify="space-between" h={16}>
            <HStack gap={2}>
              <Icon as={FiCalendar} boxSize={6} color="brand.primary" />
              <Heading fontSize="xl" fontWeight="bold" color="fg.default" letterSpacing="tight">
                Plannr
              </Heading>
            </HStack>
            <HStack gap={3}>
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={() => router.push("/signup")}>
                Sign Up
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box py={{ base: 16, md: 24 }}>
        <Container maxW="container.lg">
          <VStack gap={8} textAlign="center">
            <VStack gap={4} maxW="2xl">
              <Heading
                fontSize={{ base: "4xl", md: "6xl" }}
                fontWeight="extrabold"
                color="fg.default"
                letterSpacing="tight"
                lineHeight="tight"
              >
                Discover events that match your vibe
              </Heading>
              <Text fontSize={{ base: "lg", md: "xl" }} color="fg.muted" lineHeight="relaxed">
                Join thousands finding meaningful experiences in their city. From tech meetups to art shows, it&apos;s
                all here.
              </Text>
            </VStack>

            {/* Search Preview */}
            <Box w="full" maxW="xl">
              <Input
                placeholder="Search events in your city..."
                leftElement={<Icon as={FiSearch} />}
                onClick={() => router.push("/signup")}
                readOnly
              />
            </Box>

            <Button size="lg" variant="primary" onClick={() => router.push("/signup")}>
              Get Started
              <Icon as={FiArrowRight} ml={2} />
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Featured Events Preview */}
      <Box py={{ base: 12, md: 20 }} bg="bg.surface">
        <Container maxW="container.xl">
          <VStack gap={8}>
            <VStack gap={3} textAlign="center">
              <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="fg.default">
                Happening soon
              </Heading>
              <Text fontSize="lg" color="fg.muted">
                Get a taste of what&apos;s out there
              </Text>
            </VStack>

            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6} w="full">
              {mockEvents.map((event) => (
                <EventCardNew key={event.id} event={event} variant="detailed" showActions={false} />
              ))}
            </Grid>

            <Button variant="primary" size="lg" onClick={() => router.push("/signup")}>
              Explore More Events
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Value Props */}
      <Box py={{ base: 12, md: 20 }}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8}>
            <VStack gap={3} align="center" textAlign="center">
              <Box p={4} bg="bg.accent" borderRadius="xl">
                <Icon as={FiSearch} boxSize={8} color="brand.primary" />
              </Box>
              <Heading fontSize="xl" fontWeight="semibold" color="fg.default">
                Discover
              </Heading>
              <Text fontSize="md" color="fg.muted" lineHeight="relaxed">
                Find events tailored to your interests with smart filters and personalized recommendations
              </Text>
            </VStack>

            <VStack gap={3} align="center" textAlign="center">
              <Box p={4} bg="bg.accent" borderRadius="xl">
                <Icon as={FiCalendar} boxSize={8} color="brand.primary" />
              </Box>
              <Heading fontSize="xl" fontWeight="semibold" color="fg.default">
                Organize
              </Heading>
              <Text fontSize="md" color="fg.muted" lineHeight="relaxed">
                Create and manage your own events effortlessly with our intuitive event builder
              </Text>
            </VStack>

            <VStack gap={3} align="center" textAlign="center">
              <Box p={4} bg="bg.accent" borderRadius="xl">
                <Icon as={FiZap} boxSize={8} color="brand.primary" />
              </Box>
              <Heading fontSize="xl" fontWeight="semibold" color="fg.default">
                Connect
              </Heading>
              <Text fontSize="md" color="fg.muted" lineHeight="relaxed">
                Build your community and stay connected with people who share your passions
              </Text>
            </VStack>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box borderTopWidth="1px" borderColor="border.muted" py={8}>
        <Container maxW="container.xl">
          <HStack justify="space-between">
            <Text fontSize="sm" color="fg.muted">
              © {new Date().getFullYear()} Plannr. All rights reserved.
            </Text>
            <HStack gap={6}>
              <Text fontSize="sm" color="fg.muted" cursor="pointer" _hover={{ color: "fg.default" }}>
                Privacy
              </Text>
              <Text fontSize="sm" color="fg.muted" cursor="pointer" _hover={{ color: "fg.default" }}>
                Terms
              </Text>
              <Text fontSize="sm" color="fg.muted" cursor="pointer" _hover={{ color: "fg.default" }}>
                Contact
              </Text>
            </HStack>
          </HStack>
        </Container>
      </Box>
    </Box>
  )
}
