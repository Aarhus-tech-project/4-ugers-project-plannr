import EventDetailsCard from "@/components/EventDetailsCard"
import FilterModal from "@/components/FilterModal"
import RocketOrbitAnimation from "@/components/RocketOrbitAnimation"
import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import { mockProfile } from "@/data/mockProfile.data"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useLiveLocation } from "@/hooks/useLiveLocation"
import type { EventFormat, EventThemeName } from "@/interfaces/event"
import type { DateRangeMode } from "@/interfaces/filter"
import { FilterLocation } from "@/interfaces/filter"
import { FontAwesome6 } from "@expo/vector-icons"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { useRouter } from "expo-router"
import React, { useMemo, useRef, useState } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
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
  const theme = useCustomTheme()
  const bg = theme.colors.background
  // Get initial filter values from mockProfile.filters (type Filter)
  const { likedEvents = [], filters: initialFilters, subscribedEvents = [] } = mockProfile

  const { location: liveLocation } = useLiveLocation()

  const initialFormats: EventFormat[] = initialFilters?.formats ?? []
  const initialSelectedThemes: EventThemeName[] = initialFilters?.eventThemes ?? []
  const initialRange: FilterLocation["range"] = initialFilters?.location?.range ?? 50
  const initialUseCurrentLocation: boolean = initialFilters?.location?.useCurrent ?? true
  const initialCustomLocation = initialFilters?.location?.custom ?? null
  const initialDateRange = initialFilters?.dateRange ?? undefined
  const initialCustomStart: Date | null = initialDateRange?.custom?.startDate ?? null
  const initialCustomEnd: Date | null = initialDateRange?.custom?.endDate ?? null

  // Filter modal state
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  // Actual filter state (single source of truth)
  // Helper to convert DateRangeMode to { day, week, month, year }
  function dateRangeModeToCurrent(mode: DateRangeMode | undefined): {
    day: boolean
    week: boolean
    month: boolean
    year: boolean
  } {
    return {
      day: !!mode?.daily,
      week: !!mode?.weekly,
      month: !!mode?.monthly,
      year: !!mode?.yearly,
    }
  }
  // Helper to convert { day, week, month, year } to DateRangeMode
  function currentToDateRangeMode(
    current: { day: boolean; week: boolean; month: boolean; year: boolean } | undefined
  ): DateRangeMode {
    return {
      daily: !!current?.day,
      weekly: !!current?.week,
      monthly: !!current?.month,
      yearly: !!current?.year,
    }
  }
  const [filters, setFilters] = useState({
    formats: initialFormats,
    selectedThemes: initialSelectedThemes,
    range: initialRange,
    useCurrentLocation: initialUseCurrentLocation,
    selectedLocation: initialCustomLocation,
    customStart: initialCustomStart,
    customEnd: initialCustomEnd,
    dateRangeMode: initialDateRange?.current
      ? dateRangeModeToCurrent(currentToDateRangeMode(initialDateRange.current))
      : dateRangeModeToCurrent(undefined),
  })

  const now = new Date()

  // Filter all events (liked + subscribed) together, then split into sections
  const allEvents = useMemo(() => {
    // Remove duplicates by id (subscribedEvents take precedence)
    const map = new Map()
    for (const e of subscribedEvents) map.set(e.id, { ...e, _subscribed: true })
    for (const e of likedEvents) if (!map.has(e.id)) map.set(e.id, { ...e, _subscribed: false })
    return Array.from(map.values())
  }, [likedEvents, subscribedEvents])

  const filteredEvents = useMemo(() => {
    let events = allEvents
    // Filter by formats (attendance modes)
    if (filters.formats && filters.formats.length > 0) events = events.filter((e) => filters.formats.includes(e.format))
    // Filter by themes
    if (filters.selectedThemes && filters.selectedThemes.length > 0)
      events = events.filter((e) => e?.theme?.name !== undefined && filters.selectedThemes.includes(e.theme.name))

    // Date range: Custom mode
    if (filters.customStart && filters.customEnd) {
      events = events.filter((e) => {
        const eventStart = dayjs.utc(e.dateRange.startAt).valueOf()
        const eventEnd = e.dateRange.endAt ? dayjs.utc(e.dateRange.endAt).valueOf() : eventStart
        return (
          eventEnd >= dayjs.utc(filters.customStart).valueOf() && eventStart <= dayjs.utc(filters.customEnd).valueOf()
        )
      })
    } else if (filters.dateRangeMode) {
      // Current day/week/month/year modes
      let rangeStart = dayjs.utc(now)
      let rangeEnd = null
      if (filters.dateRangeMode.day) {
        rangeEnd = rangeStart.endOf("day")
      } else if (filters.dateRangeMode.week) {
        rangeEnd = rangeStart.endOf("week")
      } else if (filters.dateRangeMode.month) {
        rangeEnd = rangeStart.endOf("month")
      } else if (filters.dateRangeMode.year) {
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
    // Range (distance) - always apply using either current or custom location
    let loc: { latitude: number; longitude: number } | null = null
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

  // Split filtered events into upcoming (subscribed) and liked (not subscribed)
  const filteredUpcomingEvents = useMemo(() => filteredEvents.filter((e) => e._subscribed), [filteredEvents])
  const filteredLikedEvents = useMemo(() => filteredEvents.filter((e) => !e._subscribed), [filteredEvents])

  const router = useRouter()
  const { setVisible } = useTabBarVisibility()
  const lastScrollY = useRef(0)

  return (
    <>
      {/* Custom Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          paddingTop: 56,
          paddingBottom: 16,
          backgroundColor: theme.colors.secondary,
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
        {/* Filter Button & Modal */}
        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          style={{ padding: 4, borderRadius: 20, position: "absolute", right: 20, top: 52 }}
          activeOpacity={0.6}
        >
          <FontAwesome6 name="sliders" size={24} color={theme.colors.onBackground} />
        </TouchableOpacity>
      </View>
      <FilterModal
        visible={filterModalVisible}
        initial={{
          ...filters,
          dateRangeMode: currentToDateRangeMode(filters.dateRangeMode),
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
                : filters.selectedLocation &&
                  typeof filters.selectedLocation.latitude === "number" &&
                  typeof filters.selectedLocation.longitude === "number"
                ? {
                    latitude: filters.selectedLocation.latitude,
                    longitude: filters.selectedLocation.longitude,
                  }
                : null,
            customStart: newFilters.customStart ?? filters.customStart,
            customEnd: newFilters.customEnd ?? filters.customEnd,
            dateRangeMode: dateRangeModeToCurrent(newFilters.dateRangeMode) ?? filters.dateRangeMode,
          })
          setFilterModalVisible(false)
        }}
      />
      {/* Main Content: Branded intro and single event feed/empty state */}
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: bg,
        }}
      >
        <ScrollView
          style={{ flex: 1, width: "100%", paddingTop: 8 }}
          contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={8}
          onScroll={(e) => {
            const currentY = e.nativeEvent.contentOffset.y
            if (currentY > lastScrollY.current + 10) {
              setVisible(false)
            } else if (currentY < lastScrollY.current - 10) {
              setVisible(true)
            }
            lastScrollY.current = currentY
          }}
        >
          {/* Plannr intro explanation */}
          <View style={{ width: "90%", marginTop: 24, marginBottom: 32, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: theme.colors.brand.red,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Welcome to Plannr 🚀
            </Text>
            <Text style={{ fontSize: 16, color: theme.colors.onBackground, textAlign: "center", lineHeight: 24 }}>
              Plannr helps you discover, join, and create amazing events. Tap "Find Events" to explore what's happening,
              or "Create Event" to start something new. Your event feed will appear here as soon as you join or create
              your first event!
            </Text>
          </View>
          {/* Engaging empty state or event feed */}
          {filteredEvents.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                marginTop: 24,
                marginBottom: 44,
                width: "100%",
              }}
            >
              {/* Animated rocket orbiting earth */}
              <View style={{ marginBottom: 18 }}>
                <RocketOrbitAnimation />
              </View>
              <Text
                style={{
                  fontSize: 34,
                  fontWeight: "bold",
                  color: theme.colors.brand.red,
                  marginBottom: 2,
                  textAlign: "center",
                  letterSpacing: 0.5,
                  textShadowColor: theme.colors.background,
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                }}
              >
                Ready for liftoff?
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: theme.colors.gray[500] || theme.colors.onBackground,
                  marginBottom: 14,
                  textAlign: "center",
                  maxWidth: 340,
                  fontWeight: "600",
                }}
              >
                Your Plannr journey is about to begin. The best events are just waiting for you to launch them into
                orbit.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/preferences")}
                activeOpacity={0.93}
                style={{
                  backgroundColor: theme.colors.brand.red,
                  paddingVertical: 20,
                  paddingHorizontal: 48,
                  borderRadius: 38,
                  shadowColor: theme.colors.brand.red,
                  shadowOpacity: 0.22,
                  shadowRadius: 12,
                  elevation: 4,
                  marginBottom: 18,
                  width: 270,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.background,
                    fontWeight: "bold",
                    fontSize: 20,
                    textAlign: "center",
                    letterSpacing: 0.5,
                  }}
                >
                  Find Events
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/tabs/create")}
                activeOpacity={0.93}
                style={{
                  backgroundColor: theme.colors.secondary,
                  paddingVertical: 16,
                  paddingHorizontal: 40,
                  borderRadius: 38,
                  borderWidth: 2,
                  borderColor: theme.colors.brand.red,
                  width: 270,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.brand.red,
                    fontWeight: "bold",
                    fontSize: 18,
                    textAlign: "center",
                    letterSpacing: 0.5,
                  }}
                >
                  Or create your own event
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredEvents.map((event) => (
              <EventDetailsCard
                key={event.id}
                event={event}
                profile={mockProfile}
                onSubscribe={() => {
                  /* TODO: Subscribe logic */
                }}
                actionButtons={true}
                onSeeMore={() => router.push(`/event/${event.id}`)}
              />
            ))
          )}
        </ScrollView>
      </View>
    </>
  )
}
