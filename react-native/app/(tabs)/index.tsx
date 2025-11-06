import EventDetailsCard from "@/components/EventDetailsCard"
import { EventsCarousel } from "@/components/EventsCarousel"
import FilterModal from "@/components/FilterModal"
import { StatsCard } from "@/components/StatsCard"
import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useEvents } from "@/hooks/useEvents"
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
  const likedEvents = Array.isArray(userProfile?.likedEvents) ? userProfile.likedEvents : []
  const subscribedEvents = Array.isArray(userProfile?.subscribedEvents) ? userProfile.subscribedEvents : []
  const initialFilters = useUserProfileFilters(userProfile)
  const { location: liveLocation, address: liveAddress } = useLiveLocation()
  const { events: apiEvents, fetchEvents } = useEvents()

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents()
    }, [fetchEvents])
  )
  const eventsNearby = useMemo(() => {
    return filterEventsNearby(apiEvents, liveLocation, 100)
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
  // Find event objects by id for liked and subscribed events
  const allEvents = useMemo(() => {
    const map = new Map()
    // Subscribed events first
    for (const id of subscribedEvents) {
      const event = apiEvents.find((e) => e.id === id)
      if (event) map.set(event.id, { ...event, _subscribed: true })
    }
    // Liked events, but don't overwrite subscribed
    for (const id of likedEvents) {
      if (!map.has(id)) {
        const event = apiEvents.find((e) => e.id === id)
        if (event) map.set(event.id, { ...event, _subscribed: false })
      }
    }
    return Array.from(map.values())
  }, [likedEvents, subscribedEvents, apiEvents])

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
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={(newFilters) => {
          if (typeof filters.setFormats === "function") filters.setFormats(newFilters.formats ?? filters.formats)
          if (typeof filters.setSelectedThemes === "function")
            filters.setSelectedThemes(newFilters.selectedThemes ?? filters.selectedThemes)
          if (typeof filters.setRange === "function")
            filters.setRange(typeof newFilters.range === "number" ? newFilters.range : filters.range ?? 50)
          if (typeof filters.setUseCurrentLocation === "function")
            filters.setUseCurrentLocation(
              typeof newFilters.useCurrentLocation === "boolean"
                ? newFilters.useCurrentLocation
                : filters.useCurrentLocation
            )
          if (typeof filters.setSelectedLocation === "function")
            filters.setSelectedLocation(
              newFilters.selectedLocation &&
                typeof newFilters.selectedLocation.latitude === "number" &&
                typeof newFilters.selectedLocation.longitude === "number"
                ? {
                    latitude: newFilters.selectedLocation.latitude,
                    longitude: newFilters.selectedLocation.longitude,
                  }
                : null
            )
          if (typeof filters.setCustomStart === "function")
            filters.setCustomStart(newFilters.customStart ?? filters.customStart)
          if (typeof filters.setCustomEnd === "function")
            filters.setCustomEnd(newFilters.customEnd ?? filters.customEnd)
          if (typeof filters.setDateRange === "function")
            filters.setDateRange(newFilters.dateRange ?? filters.dateRange)
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
                    label: "Edit",
                    icon: "pen-to-square",
                    backgroundColor: theme.colors.brand.red,
                    textColor: theme.colors.white,
                    onPress: () => {
                      /* TODO: Implement edit logic, e.g. open edit modal or navigate */
                    },
                  },
                  {
                    label: "Delete",
                    icon: "trash",
                    backgroundColor: theme.colors.gray[700],
                    textColor: theme.colors.white,
                    onPress: () => {
                      /* TODO: Implement delete logic, e.g. show confirm dialog */
                    },
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
