"use client"

import { EventCardNew } from "@/features/profile/components/EventCardNew"
import { Navigation } from "@/shared/components/layout/Navigation"
import { Card } from "@/shared/components/ui/Card"
import { EmptyState } from "@/shared/components/ui/EmptyState"
import { Input } from "@/shared/components/ui/Input"
import type { Event, ProfileFormData } from "@/shared/types"
import { Box, Container, Flex, Grid, Heading, HStack, Text, VStack } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import * as React from "react"
import { FiCalendar, FiCheck, FiHeart, FiUser } from "react-icons/fi"

// Tab types
const tabs = [
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "myEvents", label: "My Events", icon: FiCalendar },
  { id: "going", label: "Going", icon: FiCheck },
  { id: "interested", label: "Interested", icon: FiHeart },
]

type TabType = "profile" | "myEvents" | "going" | "interested"

export default function AccountPage() {
  // Local state for going/interested event IDs for optimistic UI
  const [userGoingEvents, setUserGoingEvents] = React.useState<string[]>([])
  const [userInterestedEvents, setUserInterestedEvents] = React.useState<string[]>([])
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = React.useState<TabType>("profile")
  const [profile, setProfile] = React.useState<any>(null)
  const [allEvents, setAllEvents] = React.useState<Event[]>([])
  const [myEvents, setMyEvents] = React.useState<Event[]>([])
  const [eventsDataLoading, setEventsDataLoading] = React.useState(true)
  const [myEventsLoading, setMyEventsLoading] = React.useState(true)
  const [form, setForm] = React.useState<ProfileFormData>({
    name: "",
    email: "",
    bio: "",
    phone: "",
    image: "",
  })
  React.useEffect(() => {
    async function fetchData() {
      if (!session?.jwt || !session?.profileId) {
        setEventsDataLoading(false)
        setMyEventsLoading(false)
        return
      }
      try {
        // Fetch profile
        const res = await fetch(`/api/profiles/${session.profileId}`, {
          headers: { Authorization: `Bearer ${session.jwt}` },
        })
        const profileData = await res.json()
        setProfile(profileData)
        setUserGoingEvents(profileData.goingToEvents || [])
        setUserInterestedEvents(profileData.interestedEvents || [])

        // Fetch all events by IDs for going/interested
        const allIds = [...new Set([...(profileData.goingToEvents || []), ...(profileData.interestedEvents || [])])]
        let eventsData: Event[] = []
        if (allIds.length > 0) {
          const eventsRes = await fetch(`/api/events?ids=${allIds.join(",")}`, {
            headers: { Authorization: `Bearer ${session.jwt}` },
          })
          eventsData = await eventsRes.json()
        }
        setAllEvents(Array.isArray(eventsData) ? eventsData : [])

        // Fetch events created by the user for My Events ONLY
        const myEventsRes = await fetch(`/api/events?creatorId=${session.profileId}`, {
          headers: { Authorization: `Bearer ${session.jwt}` },
        })
        const myEventsData = await myEventsRes.json()
        setMyEvents(Array.isArray(myEventsData) ? myEventsData : [])
      } catch (error) {
        console.error("Error fetching profile/events:", error)
      } finally {
        setEventsDataLoading(false)
        setMyEventsLoading(false)
      }
    }
    fetchData()
  }, [session])

  React.useEffect(() => {
    if (session?.user) {
      setForm({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.avatarUrl || "",
        bio: session.user.bio || "",
        phone: session.user.phone || "",
      })
    }
  }, [session])

  if (status === "loading") return null
  if (!session) {
    return (
      <Box minH="100vh" bg="bg.canvas">
        <Navigation />
        <Container maxW="container.md" py={20}>
          <EmptyState icon={FiUser} title="Not logged in" description="Please log in to view your account settings." />
        </Container>
      </Box>
    )
  }

  // Filter events by tab
  const goingEvents = allEvents.filter((event) => userGoingEvents.includes(event.id || ""))
  const interestedEvents = allEvents.filter((event) => userInterestedEvents.includes(event.id || ""))

  return (
    <Box minH="100vh" bg="bg.canvas">
      <Navigation />
      <Container maxW="container.xl" py={8}>
        {/* Section Header */}
        <Box mb={8} p={8} borderRadius="2xl" bg="brand.red.500" color="white" position="relative" shadow="lg">
          <Box position="absolute" top={4} right={4} opacity={0.15}>
            <FiUser size={80} />
          </Box>
          <VStack align="start" gap={2} position="relative" zIndex={1}>
            <HStack gap={3}>
              <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                <FiUser size={32} />
              </Box>
              <Heading fontSize="3xl" fontWeight="bold">
                Profile & Events
              </Heading>
            </HStack>
            <Text fontSize="lg" opacity={0.9}>
              Manage your account and see your events
            </Text>
          </VStack>
        </Box>
        {/* Tab Navigation */}
        <Box mb={8} borderBottomWidth="1px" borderColor="border.muted">
          <Flex gap={0}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <Box
                  key={tab.id}
                  as="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  px={6}
                  py={4}
                  fontSize="md"
                  fontWeight="medium"
                  color={isActive ? "white" : "fg.muted"}
                  bg={isActive ? "brand.red.500" : "transparent"}
                  borderBottomWidth="2px"
                  borderBottomColor={isActive ? "white" : "transparent"}
                  transition="all 0.2s"
                  _hover={{
                    color: isActive ? "white" : "fg.default",
                    bg: isActive ? "brand.red.600" : "brand.red.50",
                  }}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  borderRadius="md"
                >
                  <Icon size={18} />
                  {tab.label}
                </Box>
              )
            })}
          </Flex>
        </Box>
        {/* Tab Content */}
        {activeTab === "profile" && (
          <Card p={8} borderWidth="2px" borderColor="brand.red.200" borderRadius="2xl" shadow="md" bg="white">
            <VStack gap={6} align="stretch">
              <Box>
                <Heading fontSize="xl" fontWeight="bold" color="brand.red.600" mb={2}>
                  Edit Profile
                </Heading>
                <Text fontSize="md" color="fg.muted">
                  Update your account information and preferences
                </Text>
              </Box>
              <form>
                <VStack gap={6} align="stretch">
                  <Input
                    label="Name"
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Bio"
                    id="bio"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    helperText="Tell others about yourself"
                  />
                  <Input
                    label="Phone"
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </VStack>
              </form>
            </VStack>
          </Card>
        )}
        {activeTab === "myEvents" && (
          <Card p={8} borderWidth="2px" borderColor="brand.red.200" borderRadius="2xl" shadow="md" bg="white">
            {myEventsLoading ? (
              <Text color="fg.muted">Loading your events...</Text>
            ) : myEvents.length === 0 ? (
              <EmptyState
                icon={FiCalendar}
                title="No events created yet"
                description="You haven't created any events. Start by creating your first event!"
              />
            ) : (
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                {myEvents
                  .filter((event) => event.creatorId === session.profileId)
                  .map((event) => (
                    <EventCardNew
                      key={event.id}
                      event={event}
                      variant="detailed"
                      isUserGoing={false}
                      isUserInterested={false}
                      userGoingEvents={[]}
                      userInterestedEvents={[]}
                      userProfile={profile}
                    />
                  ))}
              </Grid>
            )}
          </Card>
        )}
        {activeTab === "going" && (
          <Card p={8} borderWidth="2px" borderColor="brand.red.200" borderRadius="2xl" shadow="md" bg="white">
            {eventsDataLoading ? (
              <Text color="fg.muted">Loading events...</Text>
            ) : goingEvents.length === 0 ? (
              <EmptyState
                icon={FiCheck}
                title="No events you're attending"
                description="Browse events and mark yourself as going to see them here."
              />
            ) : (
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                {goingEvents.map((event) => (
                  <EventCardNew
                    key={event.id}
                    event={event}
                    variant="detailed"
                    isUserGoing={true}
                    isUserInterested={false}
                    userGoingEvents={userGoingEvents}
                    userInterestedEvents={userInterestedEvents}
                    userProfile={profile}
                    onUpdate={(eventId, goingArr, interestedArr) => {
                      setUserGoingEvents(goingArr)
                      setUserInterestedEvents(interestedArr)
                    }}
                  />
                ))}
              </Grid>
            )}
          </Card>
        )}
        {activeTab === "interested" && (
          <Card p={8} borderWidth="2px" borderColor="brand.red.200" borderRadius="2xl" shadow="md" bg="white">
            {eventsDataLoading ? (
              <Text color="fg.muted">Loading events...</Text>
            ) : interestedEvents.length === 0 ? (
              <EmptyState
                icon={FiHeart}
                title="No events saved"
                description="Save events you're interested in to find them easily later."
              />
            ) : (
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                {interestedEvents.map((event) => (
                  <EventCardNew
                    key={event.id}
                    event={event}
                    variant="detailed"
                    isUserGoing={false}
                    isUserInterested={true}
                    userGoingEvents={userGoingEvents}
                    userInterestedEvents={userInterestedEvents}
                    userProfile={profile}
                    onUpdate={(eventId, goingArr, interestedArr) => {
                      setUserGoingEvents(goingArr)
                      setUserInterestedEvents(interestedArr)
                    }}
                  />
                ))}
              </Grid>
            )}
          </Card>
        )}
      </Container>
    </Box>
  )
}
