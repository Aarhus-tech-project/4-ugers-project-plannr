"use client"

import { EventCardNew } from "@/features/profile/components/EventCardNew"
import { useProfileEvents } from "@/features/profile/hooks/useProfileEvents"
import { eventsService } from "@/lib/api/services/events"
import { profilesService } from "@/lib/api/services/profiles"
import { Navigation } from "@/shared/components/layout/Navigation"
import { Button } from "@/shared/components/ui/Button"
import { Card } from "@/shared/components/ui/Card"
import { EmptyState } from "@/shared/components/ui/EmptyState"
import { Input } from "@/shared/components/ui/Input"
import type { Event, Profile, ProfileFormData } from "@/shared/types"
import { Avatar, Box, Container, Flex, Grid, Heading, Stack, Text, VStack } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import * as React from "react"
import { FiCalendar, FiCheck, FiHeart, FiUser } from "react-icons/fi"

type TabType = "profile" | "myEvents" | "going" | "interested"

export default function AccountPage() {
  const { data: session, status } = useSession()
  const { events, loading: eventsLoading } = useProfileEvents()
  const [activeTab, setActiveTab] = React.useState<TabType>("profile")
  const [profile, setProfile] = React.useState<Profile | null>(null)
  const [allEvents, setAllEvents] = React.useState<Event[]>([])
  const [eventsDataLoading, setEventsDataLoading] = React.useState(true)

  const [form, setForm] = React.useState<ProfileFormData>({
    name: "",
    email: "",
    bio: "",
    phone: "",
    image: "",
  })
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch profile and events data
  React.useEffect(() => {
    async function fetchData() {
      if (!session?.jwt || !session?.profileId) {
        setEventsDataLoading(false)
        return
      }

      try {
        // Fetch profile to get event IDs
        const profileData = await profilesService.getById(session.profileId, session.jwt)
        setProfile(profileData)

        // Fetch all events by IDs
        const goingIds = profileData.goingToEvents || []
        const interestedIds = profileData.interestedEvents || []
        const allIds = [...new Set([...goingIds, ...interestedIds])]

        if (allIds.length > 0) {
          const eventsData = await eventsService.getAll(session.jwt, { ids: allIds.join(",") })
          setAllEvents(Array.isArray(eventsData) ? eventsData : [])
        }
      } catch (error) {
        console.error("Error fetching profile/events:", error)
      } finally {
        setEventsDataLoading(false)
      }
    }

    fetchData()
  }, [session])

  // Populate fields when session loads
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

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    if (!session) {
      setError("Session expired. Please login again.")
      setLoading(false)
      return
    }

    try {
      const jwt = session.jwt
      const profileId = session.profileId

      if (!jwt || !profileId) {
        setError("Missing authentication or profile ID.")
        setLoading(false)
        return
      }

      const body: Record<string, string> = {}
      // Filter events by tab
      const myEvents = (events as Event[]).filter((event) => event.creatorId === session.profileId)
      const goingEvents = allEvents.filter((event) => profile?.goingToEvents?.includes(event.id || ""))
      const interestedEvents = allEvents.filter((event) => profile?.interestedEvents?.includes(event.id || ""))

      const res = await fetch(`/api/profiles/${profileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        setError("Failed to update profile.")
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch {
      setError("Unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: "profile" as TabType, label: "Profile", icon: FiUser },
    { id: "myEvents" as TabType, label: "My Events", icon: FiCalendar },
    { id: "going" as TabType, label: "Going", icon: FiCheck },
    { id: "interested" as TabType, label: "Interested", icon: FiHeart },
  ]

  // Filter events by tab (placeholder logic for now)
  const myEvents = (events as Event[]).filter((event) => event.creatorId === session.profileId)
  const goingEvents: Event[] = [] // TODO: Implement when attendance data is available
  const interestedEvents: Event[] = [] // TODO: Implement when interested data is available

  return (
    <Box minH="100vh" bg="bg.canvas">
      <Navigation />

      <Container maxW="container.xl" py={{ base: 6, md: 10 }}>
        {/* Profile Header */}
        <Box mb={8}>
          <Stack direction={{ base: "column", sm: "row" }} gap={4} align="center">
            <Avatar.Root size="2xl" colorPalette="red" shape="full">
              <Avatar.Fallback name={session.user?.name ?? "?"} />
              {session.user?.avatarUrl ? (
                <Avatar.Image src={session.user.avatarUrl} alt={session.user?.name ?? "Avatar"} />
              ) : null}
            </Avatar.Root>
            <VStack align={{ base: "center", sm: "start" }} gap={1}>
              <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="fg.default">
                {session.user?.name}
              </Heading>
              <Text fontSize="md" color="fg.muted">
                {session.user?.email}
              </Text>
            </VStack>
          </Stack>
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
                  onClick={() => setActiveTab(tab.id)}
                  px={6}
                  py={4}
                  fontSize="md"
                  fontWeight="medium"
                  color={isActive ? "brand.primary" : "fg.muted"}
                  borderBottomWidth="2px"
                  borderBottomColor={isActive ? "brand.primary" : "transparent"}
                  transition="all 0.2s"
                  _hover={{
                    color: isActive ? "brand.primary" : "fg.default",
                  }}
                  display="flex"
                  alignItems="center"
                  gap={2}
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
          <Card variant="elevated" p={{ base: 6, md: 8 }} maxW="container.md">
            <VStack gap={6} align="stretch">
              <Box>
                <Heading fontSize="xl" fontWeight="bold" color="fg.default" mb={2}>
                  Edit Profile
                </Heading>
                <Text fontSize="sm" color="fg.muted">
                  Update your account information and preferences
                </Text>
              </Box>

              {/* Form */}
              <form onSubmit={handleUpdate}>
                <VStack gap={6} align="stretch">
                  {success && (
                    <Box p={4} bg="green.50" borderRadius="md" borderWidth="1px" borderColor="green.200">
                      <Text color="green.700" fontWeight="semibold">
                        Profile updated successfully!
                      </Text>
                    </Box>
                  )}
                  {error && (
                    <Box p={4} bg="red.50" borderRadius="md" borderWidth="1px" borderColor="red.200">
                      <Text color="red.700" fontWeight="semibold">
                        {error}
                      </Text>
                    </Box>
                  )}

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

                  <Button type="submit" size="lg" loading={loading} width="full" mt={4}>
                    Save Changes
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Card>
        )}

        {activeTab === "myEvents" && (
          <Box>
            {eventsLoading ? (
              <Text color="fg.muted">Loading your events...</Text>
            ) : myEvents.length === 0 ? (
              <EmptyState
                icon={FiCalendar}
                title="No events created yet"
                description="You haven't created any events. Start by creating your first event!"
              />
            ) : (
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                {myEvents.map((event) => (
                  <EventCardNew key={event.id} event={event} variant="detailed" />
                ))}
              </Grid>
            )}
          </Box>
        )}

        {activeTab === "going" && (
          <Box>
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
                  <EventCardNew key={event.id} event={event} variant="detailed" />
                ))}
              </Grid>
            )}
          </Box>
        )}

        {activeTab === "interested" && (
          <Box>
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
                  <EventCardNew key={event.id} event={event} variant="detailed" />
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Container>
    </Box>
  )
}
