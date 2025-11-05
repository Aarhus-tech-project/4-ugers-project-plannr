import EventDetailsCard from "@/components/EventDetailsCard"
import { EventsCarousel } from "@/components/EventsCarousel"
import FilterModal from "@/components/FilterModal"
import { StatsCard } from "@/components/StatsCard"
import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import mockEvents from "@/data/mockEvents.data"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useLiveLocation } from "@/hooks/useLiveLocation"
import { useScrollDrivenAnimation } from "@/hooks/useScrollDrivenAnimation"
import { useSession, useUserProfileFilters } from "@/hooks/useSession"
import type { Profile } from "@/interfaces/profile"
import { FontAwesome6 } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import React, { useMemo, useState } from "react"
import { Animated, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

dayjs.extend(utc)

// Haversine formula to calculate distance between two lat/lng points in km
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

export default function Home() {
  const { setScrollY } = useTabBarVisibility()
  const { scrollY, onScroll } = useScrollDrivenAnimation({ hideDistance: 80, fade: true })
  // Set scrollY in context and reset to 0 when page is focused
  useFocusEffect(
    React.useCallback(() => {
      setScrollY(scrollY)
      scrollY.setValue(0)
    }, [scrollY, setScrollY])
  )
  const theme = useCustomTheme()
  const { session } = useSession()
  const userProfile: Profile | undefined = session?.user as Profile | undefined
  const likedEvents = Array.isArray(userProfile?.likedEvents) ? userProfile.likedEvents : []
  const subscribedEvents = Array.isArray(userProfile?.subscribedEvents) ? userProfile.subscribedEvents : []
  const initialFilters = useUserProfileFilters(userProfile)
  const { location: liveLocation, address: liveAddress } = useLiveLocation()
  const eventsNearby = useMemo(() => {
    if (!liveLocation?.coords) return []
    return mockEvents.filter((e) => {
      if (!e.location || typeof e.location.latitude !== "number" || typeof e.location.longitude !== "number")
        return false
      const dist = getDistanceFromLatLonInKm(
        liveLocation.coords.latitude,
        liveLocation.coords.longitude,
        e.location.latitude,
        e.location.longitude
      )
      return dist <= 100
    })
  }, [liveLocation])
  const statsNearby = useMemo(() => {
    if (!liveLocation?.coords || eventsNearby.length === 0) return null
    let closestEvent = undefined
    let minDist = Infinity
    let totalInterested = 0
    for (const e of eventsNearby) {
      if (!e.location) continue
      const dist = getDistanceFromLatLonInKm(
        liveLocation.coords.latitude,
        liveLocation.coords.longitude,
        e.location.latitude ?? 0,
        e.location.longitude ?? 0
      )
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
  const initialFormats = initialFilters.formats
  const initialSelectedThemes = initialFilters.eventThemes
  const initialRange = initialFilters.location.range
  const initialUseCurrentLocation = initialFilters.location.useCurrent
  const initialCustomLocation = initialFilters.location.custom
  const initialDateRange = initialFilters.dateRange
  const initialCustomStart = initialDateRange.custom?.startDate ?? null
  const initialCustomEnd = initialDateRange.custom?.endDate ?? null
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const [filters, setFilters] = useState({
    formats: initialFormats,
    selectedThemes: initialSelectedThemes,
    range: initialRange,
    useCurrentLocation: initialUseCurrentLocation,
    selectedLocation: initialCustomLocation,
    customStart: initialCustomStart,
    customEnd: initialCustomEnd,
    dateRange: initialDateRange ?? {},
  })
  const now = new Date()
  // Find event objects by id for liked and subscribed events
  const allEvents = useMemo(() => {
    const map = new Map()
    // Subscribed events first
    for (const id of subscribedEvents) {
      const event = mockEvents.find((e) => e.id === id)
      if (event) map.set(event.id, { ...event, _subscribed: true })
    }
    // Liked events, but don't overwrite subscribed
    for (const id of likedEvents) {
      if (!map.has(id)) {
        const event = mockEvents.find((e) => e.id === id)
        if (event) map.set(event.id, { ...event, _subscribed: false })
      }
    }
    return Array.from(map.values())
  }, [likedEvents, subscribedEvents])
  const _filteredEvents = useMemo(() => {
    let events = allEvents
    if (filters.formats && filters.formats.length > 0) events = events.filter((e) => filters.formats.includes(e.format))
    if (filters.selectedThemes && filters.selectedThemes.length > 0)
      events = events.filter(
        (e) =>
          Array.isArray(e.themes) &&
          e.themes.some((t: import("@/interfaces/event").EventThemeName) => filters.selectedThemes.includes(t))
      )
    if (filters.customStart && filters.customEnd) {
      events = events.filter((e) => {
        const eventStart = dayjs.utc(e.dateRange.startAt).valueOf()
        const eventEnd = e.dateRange.endAt ? dayjs.utc(e.dateRange.endAt).valueOf() : eventStart
        return (
          eventEnd >= dayjs.utc(filters.customStart).valueOf() && eventStart <= dayjs.utc(filters.customEnd).valueOf()
        )
      })
    } else if (filters.dateRange && filters.dateRange.current) {
      let rangeStart = dayjs.utc(now)
      let rangeEnd = null
      if (filters.dateRange.current.day) {
        rangeEnd = rangeStart.endOf("day")
      } else if (filters.dateRange.current.week) {
        rangeEnd = rangeStart.endOf("week")
      } else if (filters.dateRange.current.month) {
        rangeEnd = rangeStart.endOf("month")
      } else if (filters.dateRange.current.year) {
        rangeEnd = rangeStart.endOf("year")
      }
      if (rangeEnd) {
        events = events.filter((e) => {
          const eventStart = dayjs.utc(e.dateRange.startAt)
          const eventEnd = e.dateRange.endAt ? dayjs.utc(e.dateRange.endAt) : eventStart
          return eventEnd.isAfter(rangeStart) && eventStart.isBefore(rangeEnd)
        })
      }
    }
    let loc = null
    if (filters.useCurrentLocation) {
      loc = {
        latitude: typeof liveLocation?.coords.latitude === "number" ? liveLocation.coords.latitude : 0,
        longitude: typeof liveLocation?.coords.longitude === "number" ? liveLocation.coords.longitude : 0,
      }
    } else {
      loc =
        filters.selectedLocation &&
        typeof filters.selectedLocation.latitude === "number" &&
        typeof filters.selectedLocation.longitude === "number"
          ? { latitude: filters.selectedLocation.latitude, longitude: filters.selectedLocation.longitude }
          : null
    }
    if (loc) {
      events = events.filter((e) => {
        const lat = typeof e.location?.latitude === "number" ? e.location.latitude : 0
        const lng = typeof e.location?.longitude === "number" ? e.location.longitude : 0
        const dist = getDistanceFromLatLonInKm(loc.latitude, loc.longitude, lat, lng)
        return dist <= (filters.range ?? 50)
      })
    }
    return events
      .filter((e) => dayjs.utc(e.dateRange.startAt).isAfter(dayjs.utc(now)))
      .sort((a, b) => {
        const aStart = a?.dateRange?.startAt ? dayjs.utc(a.dateRange.startAt).valueOf() : 0
        const bStart = b?.dateRange?.startAt ? dayjs.utc(b.dateRange.startAt).valueOf() : 0
        return aStart - bStart
      })
  }, [allEvents, filters, now])

  // Collapsible header logic
  const [headerHeight, setHeaderHeight] = useState(0)
  return (
    <View style={{ flex: 1 }}>
      <FilterModal
        visible={filterModalVisible}
        initial={{
          ...filters,
        }}
        onClose={() => setFilterModalVisible(false)}
        onApply={(newFilters) => {
          setFilters({
            formats: newFilters.formats ?? filters.formats,
            selectedThemes: newFilters.selectedThemes ?? filters.selectedThemes,
            range: typeof newFilters.range === "number" ? newFilters.range : filters.range ?? 50,
            useCurrentLocation:
              typeof newFilters.useCurrentLocation === "boolean"
                ? newFilters.useCurrentLocation
                : filters.useCurrentLocation,
            selectedLocation:
              newFilters.selectedLocation &&
              typeof newFilters.selectedLocation.latitude === "number" &&
              typeof newFilters.selectedLocation.longitude === "number"
                ? {
                    latitude: newFilters.selectedLocation.latitude,
                    longitude: newFilters.selectedLocation.longitude,
                  }
                : undefined,
            customStart: newFilters.customStart ?? filters.customStart,
            customEnd: newFilters.customEnd ?? filters.customEnd,
            dateRange: newFilters.dateRange ?? filters.dateRange,
          })
          setFilterModalVisible(false)
        }}
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
        contentContainerStyle={{ alignItems: "center", paddingBottom: 40, backgroundColor: theme.colors.background }}
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
        {_filteredEvents.map((event) => (
          <View key={event.id} style={{ width: "90%", marginBottom: 18 }}>
            <EventDetailsCard event={event} actionButtons={true} />
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  )
}
