import EventDetailsCard from "@/components/EventDetailsCard"
import { EventsCarousel } from "@/components/EventsCarousel"
import FilterModal from "@/components/FilterModal"
import { StatsCard } from "@/components/StatsCard"
import { useAppData } from "@/context/AppDataContext"
import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useFilters } from "@/hooks/useFilters"
import { useLiveLocation } from "@/hooks/useLiveLocation"
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
  const { session } = useSession()
  const userProfile: Profile | undefined = session?.profile
  const interestedEvents = Array.isArray(userProfile?.interestedEvents) ? userProfile.interestedEvents : []
  const goingToEvents = Array.isArray(userProfile?.goingToEvents) ? userProfile.goingToEvents : []
  const initialFilters = useUserProfileFilters(userProfile)
  const { location: liveLocation, address: liveAddress } = useLiveLocation()
  const { events: apiEvents, fetchEvents, likeEvent, updateProfile } = useAppData()

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents()
    }, [fetchEvents])
  )
  const eventsNearby = useMemo(() => {
    const nearby = filterEventsNearby(apiEvents, liveLocation, 100)
    return nearby
  }, [liveLocation, apiEvents])

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
  const filters = useFilters(initialFilters)
  const now = new Date()
  // Show all events, but highlight liked/upcoming
  const allEvents = useMemo(() => {
    return apiEvents.map((event) => ({
      ...event,
      _going: typeof event.id === "string" && goingToEvents.includes(event.id),
      _interested: typeof event.id === "string" && interestedEvents.includes(event.id),
    }))
  }, [apiEvents, goingToEvents, interestedEvents])

  const _filteredEvents = useMemo(() => {
    // Map selectedThemes (EventThemeName[]) to EventTheme[] for filterEvents
    const selectedThemes = (filters.selectedThemes ?? []).map((name) => ({ name, icon: "other" as const }))
    // Ensure customLocation always has latitude/longitude as numbers
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
    const filtered = filterEvents(allEvents, {
      eventTypes: filters.formats ?? [],
      selectedThemes,
      dateRangeMode: filters.mode ?? { daily: true },
      customStart: filters.customStart ?? null,
      customEnd: filters.customEnd ?? null,
      customLocation,
      liveLocation,
      range: filters.range ?? 50,
    })
    return filtered
      .filter((e) => dayjs.utc(e.dateRange.startAt).isAfter(dayjs.utc(now)))
      .sort((a, b) => {
        const aStart = a?.dateRange?.startAt ? dayjs.utc(a.dateRange.startAt).valueOf() : 0
        const bStart = b?.dateRange?.startAt ? dayjs.utc(b.dateRange.startAt).valueOf() : 0
        return aStart - bStart
      })
  }, [allEvents, filters, liveLocation, now])

  // Collapsible header logic
  const [headerHeight, setHeaderHeight] = useState(0)

  const handleEventButtonPress = async (event: any) => {
    if (event._going) {
      // Remove from going, add to not interested
      if (userProfile?.id && event.id) {
        await updateProfile(userProfile.id, {
          goingToEvents: userProfile.goingToEvents?.filter((eid) => eid !== event.id) || [],
          notInterestedEvents: [...(userProfile.notInterestedEvents || []), event.id],
        })
        // Optionally decrement going count here if needed
      }
    } else if (event._interested) {
      // Remove from interested, add to going
      if (userProfile?.id && event.id) {
        await updateProfile(userProfile.id, {
          interestedEvents: userProfile.interestedEvents?.filter((eid) => eid !== event.id) || [],
          goingToEvents: [...(userProfile.goingToEvents || []), event.id],
        })
        // Optionally increment going count, decrement interested count
      }
    } else {
      // Not interested: add to interested
      if (userProfile?.id && event.id) {
        await likeEvent(event.id, userProfile.id)
      }
    }
    await fetchEvents()
    // await fetchProfiles() // Uncomment if needed
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
            <EventsCarousel data={eventsNearby} liveLocation={liveLocation?.coords ? liveLocation : undefined} />
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
