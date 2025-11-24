import { EventsCarousel } from "@/components/event/carousel/EventsCarousel"
import EventDetailsCard from "@/components/event/details/EventDetailsCard"
import EventPage from "@/components/event/page/EventPage"
import FilterModal from "@/components/modals/FilterModal"
import { StatsCard } from "@/components/ui/StatsCard"
import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useEvents } from "@/hooks/useEvents"
import { useFilters } from "@/hooks/useFilters"
import { useLiveLocation } from "@/hooks/useLiveLocation"
import { useProfiles } from "@/hooks/useProfiles"
import { useScrollDrivenAnimation } from "@/hooks/useScrollDrivenAnimation"
import { useSession, useUserProfileFilters } from "@/hooks/useSession"
import type { Profile } from "@/interfaces/profile"
import { filterEvents, filterEventsNearby, getDistance } from "@/utils/eventFilterUtils"
import { FontAwesome6 } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import React, { useMemo, useState } from "react"
import { Animated, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

dayjs.extend(utc)

export default function Home() {
  const { setScrollY } = useTabBarVisibility()
  const { scrollY, onScroll } = useScrollDrivenAnimation({ hideDistance: 80, fade: true })
  useFocusEffect(
    React.useCallback(() => {
      setScrollY(scrollY)
      scrollY.setValue(0)
    }, [scrollY, setScrollY])
  )
  const theme = useCustomTheme()
  const { session, setProfile } = useSession()
  const userProfile: Profile | undefined = session?.profile
  const interestedEvents = Array.isArray(userProfile?.interestedEvents) ? userProfile.interestedEvents : []
  const goingToEvents = Array.isArray(userProfile?.goingToEvents) ? userProfile.goingToEvents : []
  const initialFilters = useUserProfileFilters(userProfile)
  const filters = useFilters(initialFilters)
  const { location: liveLocation, address: liveAddress } = useLiveLocation()
  const { fetchEvents } = useEvents()
  const { api } = require("@/config/api")
  const { updateProfile } = useProfiles()
  const apiEvents = fetchEvents.data ?? []

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents.run()
    }, [fetchEvents.run])
  )
  const eventsNearby = useMemo(() => {
    const nearby = filterEventsNearby(apiEvents, liveLocation, 100)
    // Filter out own events, liked events, and going events
    return nearby.filter(
      (event: any) =>
        event.creatorId !== userProfile?.id && !interestedEvents.includes(event.id) && !goingToEvents.includes(event.id)
    )
  }, [liveLocation, apiEvents, userProfile?.id, interestedEvents, goingToEvents])

  const statsNearby = useMemo(() => {
    if (!liveLocation?.coords || eventsNearby.length === 0) return null
    let closestEvent = undefined
    let minDist = Infinity
    let totalInterested = 0
    for (const e of eventsNearby) {
      if (!e.location) continue
      const dist =
        getDistance(
          liveLocation.coords.latitude,
          liveLocation.coords.longitude,
          e.location.latitude ?? 0,
          e.location.longitude ?? 0
        ) / 1000 // convert meters to km
      if (dist < minDist) {
        minDist = dist
        closestEvent = e
      }
      if (e.attendance?.interested) totalInterested += e.attendance.interested
    }
    return {
      count: eventsNearby.length,
      closest: closestEvent ? { title: closestEvent.title } : undefined,
      minDist,
      totalInterested,
    }
  }, [liveLocation, eventsNearby])

  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const now = new Date()
  // Only show events the user is going to or interested in
  const allEvents = useMemo(() => {
    return (apiEvents as any[])
      .filter(
        (event: any) =>
          event.creatorId !== userProfile?.id &&
          (goingToEvents.includes(event.id) || interestedEvents.includes(event.id))
      )
      .map((event: any) => ({
        ...event,
        _going: typeof event.id === "string" && goingToEvents.includes(event.id),
        _interested: typeof event.id === "string" && interestedEvents.includes(event.id),
      }))
  }, [apiEvents, goingToEvents, interestedEvents, userProfile?.id])

  const _filteredEvents = useMemo(() => {
    // Map selectedThemes (EventThemeName[]) to EventTheme[] for filterEvents
    const selectedThemes = (filters.selectedThemes ?? []).map((name) => ({ name, icon: "other" as const }))
    let customLocation = null
    if (
      filters.selectedLocation &&
      typeof filters.selectedLocation.latitude === "number" &&
      typeof filters.selectedLocation.longitude === "number"
    ) {
      customLocation = {
        latitude: filters.selectedLocation.latitude,
        longitude: filters.selectedLocation.longitude,
      }
    }
    // Events matching filters
    const filtered = filterEvents(allEvents, {
      eventTypes: filters.formats ?? [],
      selectedThemes,
      dateRangeMode: filters.mode ?? { daily: true },
      customStart: filters.customStart ?? null,
      customEnd: filters.customEnd ?? null,
      customLocation,
      liveLocation,
      range: filters.range ?? 50,
    }).filter((e) => {
      const startAt = e.dateRange?.startAt || e.startAt
      return startAt && dayjs.utc(startAt).isAfter(dayjs.utc(now))
    })
    // Always include user's going/interested events (if in the future)
    const userEvents = allEvents.filter(
      (e) =>
        (e._going || e._interested) &&
        ((e.dateRange?.startAt && dayjs.utc(e.dateRange.startAt).isAfter(dayjs.utc(now))) ||
          (e.startAt && dayjs.utc(e.startAt).isAfter(dayjs.utc(now))))
    )
    // Merge and dedupe by event id
    const merged = [...filtered, ...userEvents].filter(
      (event, idx, arr) => arr.findIndex((e) => e.id === event.id) === idx
    )
    return merged.sort((a, b) => {
      const aStart = a?.dateRange?.startAt
        ? dayjs.utc(a.dateRange.startAt).valueOf()
        : a?.startAt
        ? dayjs.utc(a.startAt).valueOf()
        : 0
      const bStart = b?.dateRange?.startAt
        ? dayjs.utc(b.dateRange.startAt).valueOf()
        : b?.startAt
        ? dayjs.utc(b.startAt).valueOf()
        : 0
      return aStart - bStart
    })
  }, [
    allEvents,
    filters.selectedThemes,
    filters.formats,
    filters.mode,
    filters.customStart,
    filters.customEnd,
    filters.selectedLocation,
    filters.range,
    liveLocation,
    now,
  ])

  // Collapsible header logic
  const [headerHeight, setHeaderHeight] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const handleEventButtonPress = async (event: any) => {
    if (!userProfile?.id || !event.id) {
      console.warn("handleEventButtonPress: missing userProfile or event.id", { userProfile, event })
      return
    }
    try {
      // Always fetch the full profile first
      const currentProfile = await api.profiles.get(userProfile.id)
      if (!currentProfile) {
        console.error("Could not fetch current profile for update")
        return
      }
      let updatedProfileObj = { ...currentProfile }
      let goingChanged = false
      if (event._going) {
        // Move from going to interested (never to not interested)
        updatedProfileObj.goingToEvents = (currentProfile.goingToEvents ?? []).filter((eid: string) => eid !== event.id)
        updatedProfileObj.interestedEvents = [...new Set([...(currentProfile.interestedEvents ?? []), event.id])]
        goingChanged = true
      } else {
        // Move from interested to going
        updatedProfileObj.interestedEvents = (currentProfile.interestedEvents ?? []).filter(
          (eid: string) => eid !== event.id
        )
        updatedProfileObj.goingToEvents = [...new Set([...(currentProfile.goingToEvents ?? []), event.id])]
        goingChanged = true
      }
      await updateProfile.run(userProfile.id, updatedProfileObj)
      // Patch event attendance for going
      if (goingChanged) {
        try {
          // Fetch latest event to get current going count
          const latestEvent = await api.events.get(event.id)
          const currentGoing = latestEvent?.attendance?.going ?? 0
          let newGoing = currentGoing
          if (event._going) {
            // User is leaving going
            newGoing = Math.max(0, currentGoing - 1)
          } else {
            // User is joining going
            newGoing = currentGoing + 1
          }
          await api.events.patchAttendance(event.id, { going: newGoing })
        } catch (err) {
          console.error("Failed to patch event going attendance", err)
        }
      }
      // Always fetch the latest profile after update
      const fetchedProfile = await api.profiles.get(userProfile.id)
      if (fetchedProfile && fetchedProfile.id) {
        setProfile(fetchedProfile)
      } else {
        console.error("Fetched profile is invalid", fetchedProfile)
      }
    } catch (err) {
      console.error("Error in handleEventButtonPress", err)
    }
    await fetchEvents.run()
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Event modal */}
      {selectedEvent && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            backgroundColor: theme.colors.background + "F2",
            justifyContent: "flex-end",
          }}
        >
          <EventPage
            event={selectedEvent}
            showHeader
            headerTitle={selectedEvent.title}
            onBack={() => setSelectedEvent(null)}
          />

          <Animated.View
            style={{
              position: "absolute",
              right: 0,
              bottom: 114,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 24,
              zIndex: 10,
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, 80],
                    outputRange: [0, 80],
                    extrapolate: "clamp",
                  }),
                },
              ],
              opacity: 1,
            }}
          >
            {/* Interested button for near events */}
            {!goingToEvents.includes(selectedEvent.id) && !interestedEvents.includes(selectedEvent.id) && (
              <TouchableOpacity
                onPress={async () => {
                  await handleEventButtonPress(selectedEvent)
                  setSelectedEvent(null)
                  // Refetch events and scroll to top after liking
                  await fetchEvents.run()
                }}
                activeOpacity={0.9}
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: theme.colors.brand.red,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: theme.colors.gray[700],
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                  }}
                >
                  <FontAwesome6 name="heart" size={32} color={theme.colors.secondary} />
                </View>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      )}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onApply={() => setFilterModalVisible(false)}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          paddingTop: 56,
          paddingBottom: 16,
          backgroundColor: theme.colors.secondary,
          zIndex: 100,
        }}
      >
        <Text
          style={{
            color: theme.colors.onBackground,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 20,
          }}
        >
          Events
        </Text>
        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          style={{ padding: 4, borderRadius: 20, position: "absolute", right: 20, top: 52, zIndex: 101 }}
          activeOpacity={0.6}
        >
          <FontAwesome6 name="sliders" size={24} color={theme.colors.onBackground} />
        </TouchableOpacity>
      </View>
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={8}
        bounces={false}
        alwaysBounceVertical={false}
        onScroll={onScroll}
      >
        <Animated.View
          onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
          style={{
            width: "100%",
            alignItems: "center",
            opacity: scrollY.interpolate({
              inputRange: [0, headerHeight],
              outputRange: [1, 0],
              extrapolate: "clamp",
            }),
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, headerHeight],
                  outputRange: [0, -headerHeight / 2],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
        >
          <View style={{ width: "90%", alignItems: "center", paddingTop: 12 }}>
            <StatsCard
              liveAddress={liveAddress}
              liveLocation={liveLocation?.coords ? liveLocation : undefined}
              statsNearby={statsNearby}
              loading={!liveLocation}
            />
          </View>
          <View style={{ width: "90%", alignItems: "center", paddingBottom: 8 }}>
            <EventsCarousel
              data={eventsNearby}
              liveLocation={liveLocation?.coords ? liveLocation : undefined}
              onEventPress={setSelectedEvent}
            />
          </View>
        </Animated.View>
        {/* Main content area: event cards or fallback */}
        <View style={{ width: "90%", alignItems: "flex-start", paddingTop: 32, paddingBottom: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: theme.colors.onBackground, marginBottom: 8 }}>
            Your Upcoming & Liked Events
          </Text>
        </View>
        {_filteredEvents.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 32,
            }}
          >
            <FontAwesome6 name="face-sad-tear" size={64} color={theme.colors.brand.red} style={{ marginBottom: 16 }} />
            <Text style={{ fontSize: 22, fontWeight: "bold", color: theme.colors.onBackground, marginBottom: 8 }}>
              No events found!
            </Text>
            <Text style={{ fontSize: 16, color: theme.colors.gray[500], textAlign: "center", maxWidth: 280 }}>
              There are no upcoming or liked events. Try subscribing to events or check back later!
            </Text>
          </View>
        ) : (
          _filteredEvents.map((event) => (
            <View key={event.id} style={{ width: "90%", marginBottom: 18 }}>
              <EventDetailsCard
                event={event}
                displayTitle={true}
                going={event._going}
                buttons={[
                  {
                    label: event._going ? "Going" : event._interested ? "Interested" : "Not Interested",
                    icon: event._going ? "check-circle" : event._interested ? "star" : "circle",
                    backgroundColor: theme.colors.brand.red,
                    textColor: theme.colors.white,
                    onPress: () => handleEventButtonPress(event),
                  },
                ]}
              />
            </View>
          ))
        )}
      </Animated.ScrollView>
    </View>
  )
}
