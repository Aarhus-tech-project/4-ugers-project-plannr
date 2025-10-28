import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import { mockProfile } from "@/data/mockProfile.data"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useMemo, useRef, useState } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"
import EventDetailsCard from "../components/EventDetailsCard"
import { EventFormat } from "../components/FilterBar"

export default function Home() {
  const theme = useCustomTheme()
  const bg = theme.colors.background
  const { likedEvents = [], subscribedEvents = [] } = mockProfile
  // Combine all events for filtering (demo: liked + subscribed, deduped by id)
  const allEvents = useMemo(() => {
    const map = new Map()
    ;[...(likedEvents || []), ...(subscribedEvents || [])].forEach((e) => map?.set(e.id, e))
    return Array?.from(map?.values())
  }, [likedEvents, subscribedEvents])

  // Filter state (event format)
  const [selectedFormat, setSelectedFormat] = useState<EventFormat>("all")

  // Filtered events by format
  const filteredEvents = useMemo(() => {
    let events = allEvents
    if (selectedFormat !== "all") events = events.filter((e) => e.format === selectedFormat)
    return events.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
  }, [allEvents, selectedFormat])

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
          paddingTop: 46,
          paddingBottom: 16,
          backgroundColor: theme.colors.secondary,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 4, borderRadius: 20, position: "absolute", left: 20, top: 42 }}
          activeOpacity={0.6}
        >
          <FontAwesome6 name="chevron-left" size={24} color={theme.colors.onBackground} />
        </TouchableOpacity>
        <Text
          style={{
            color: theme.colors.onBackground,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 20,
          }}
        >
          Home
        </Text>
      </View>
      {/* Main Content */}
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
          {filteredEvents.length > 0 ? (
            <View
              style={{
                width: "96%",
                marginTop: 18,
                marginBottom: 18,
                backgroundColor: theme.colors.secondary,
                borderRadius: 18,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  marginBottom: 18,
                  color: theme.colors.onBackground,
                  letterSpacing: 0.5,
                }}
              >
                Events
              </Text>
              {filteredEvents.map((event) => (
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
              ))}
            </View>
          ) : (
            <Text style={{ color: theme.colors.onBackground, marginTop: 32 }}>No events found.</Text>
          )}
        </ScrollView>
      </View>
    </>
  )
}
