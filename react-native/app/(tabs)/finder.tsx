import EventPage from "@/components/EventPage"
import { useAppData } from "@/context/AppDataContext"
import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useLiveLocation } from "@/hooks/useLiveLocation"
import { usePreferences } from "@/hooks/usePreferences"
import { useScrollDrivenAnimation } from "@/hooks/useScrollDrivenAnimation"
import { filterEvents } from "@/utils/eventFilterUtils"
import { FontAwesome6 } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import React, { useState } from "react"
import { Animated, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

export default function Finder() {
  const theme = useCustomTheme()
  const { setScrollY } = useTabBarVisibility()
  const { session, likeEvent, dislikeEvent, fetchProfiles, events, fetchEvents } = useAppData()
  const {
    range,
    selectedThemes,
    dateRangeMode,
    eventTypes,
    customStart,
    customEnd,
    customLocation,
    reloadPreferences,
  } = usePreferences()
  const { location: liveLocation } = useLiveLocation()
  useFocusEffect(
    React.useCallback(() => {
      const fetchAndFilter = async () => {
        await fetchEvents()
        await reloadPreferences()
        setCurrent(0)
      }
      fetchAndFilter()
    }, [fetchEvents, reloadPreferences])
  )

  // Track current event index
  const [current, setCurrent] = useState(0)
  if (!session) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading user session...</Text>
      </View>
    )
  }
  const userProfile = session?.profile
  const likedEventIds = userProfile?.interestedEvents ?? []
  const filteredEvents = filterEvents(events, {
    eventTypes,
    selectedThemes,
    dateRangeMode,
    customStart,
    customEnd,
    customLocation,
    liveLocation,
    range,
  }).filter((event) => !likedEventIds.includes(event.id))

  // Current event from filtered list
  const event = filteredEvents[current] || null

  // Accept/deny event handlers
  const denyEvent = async () => {
    if (userProfile?.id && event?.id) {
      await dislikeEvent(event.id, userProfile.id)
      await fetchEvents()
      await fetchProfiles()
    }
    setCurrent((prev) => Math.min(prev + 1, filteredEvents.length))
  }
  const acceptEvent = async () => {
    if (!userProfile) {
      console.warn("No user profile found, cannot like event.")
      setCurrent((prev) => Math.min(prev + 1, filteredEvents.length))
      return
    }
    if (event && userProfile.id) {
      await likeEvent(event.id, userProfile.id)
      await fetchEvents()
      await fetchProfiles()
    }
    setCurrent(0)
  }

  // Use scroll-driven animation hook
  const { scrollY, onScroll } = useScrollDrivenAnimation({ hideDistance: 80, fade: true })
  // Set scrollY in context and reset to 0 when page is focused
  useFocusEffect(
    React.useCallback(() => {
      setScrollY(scrollY)
      scrollY.setValue(0)
    }, [scrollY, setScrollY])
  )

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
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
          Finder
        </Text>
      </View>
      {event ? (
        <EventPage event={event} onScroll={onScroll} scrollY={scrollY} showHeader={false} />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.background,
          }}
        >
          <FontAwesome6 name="face-sad-tear" size={64} color={theme.colors.brand.red} style={{ marginBottom: 16 }} />
          <Text style={{ fontSize: 22, fontWeight: "bold", color: theme.colors.onBackground, marginBottom: 8 }}>
            No more events nearby!
          </Text>
          <Text style={{ fontSize: 16, color: theme.colors.gray[500], textAlign: "center", maxWidth: 280 }}>
            You've seen all available events. Check back later or adjust your filters to discover more!
          </Text>
        </View>
      )}
      {/* Bottom Like/Dislike Buttons, always visible and move up to fill bar space */}
      {event && (
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
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
          <TouchableOpacity onPress={denyEvent} activeOpacity={0.9}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: theme.colors.secondary,
                justifyContent: "center",
                alignItems: "center",
                elevation: 4,
                shadowColor: theme.colors.gray[700],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }}
            >
              <FontAwesome6 name="xmark" size={32} color={theme.colors.brand.red} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={acceptEvent} activeOpacity={0.9}>
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
        </Animated.View>
      )}
    </View>
  )
}
