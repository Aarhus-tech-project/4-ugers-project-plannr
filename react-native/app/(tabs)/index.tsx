import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import { mockProfile } from "@/data/mockProfile.data"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import type { EventFormat } from "@/interfaces/event"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useMemo, useRef, useState } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"
import EventDetailsCard from "../components/EventDetailsCard"
import FilterModal from "../components/FilterModal"

export default function Home() {
  const theme = useCustomTheme()
  const bg = theme.colors.background
  const { likedEvents = [] } = mockProfile

  // Filter modal state
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [eventType, setEventType] = useState<EventFormat | null>(null)
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [rangeKm, setRangeKm] = useState<number>(50)
  const [customStart, setCustomStart] = useState<Date | null>(null)
  const [customEnd, setCustomEnd] = useState<Date | null>(null)

  // Filtered liked events by modal filters
  const filteredEvents = useMemo(() => {
    let events = likedEvents
    if (eventType) events = events.filter((e) => e.format === eventType)
    if (selectedThemes.length > 0) events = events.filter((e) => selectedThemes.includes(e.theme?.name ?? ""))
    // Optionally add rangeKm, customStart, customEnd filtering here
    return events.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
  }, [likedEvents, eventType, selectedThemes, rangeKm, customStart, customEnd])

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
        {/* Filter Button & Modal */}
        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          style={{ padding: 4, borderRadius: 20, position: "absolute", right: 20, top: 42 }}
          activeOpacity={0.6}
        >
          <FontAwesome6 name="sliders" size={24} color={theme.colors.onBackground} />
        </TouchableOpacity>
      </View>
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={{
          eventType: eventType ?? "inperson",
          setEventType: (v) => setEventType(v),
          selectedThemes,
          setSelectedThemes,
          rangeKm,
          setRangeKm,
          dateRange: "custom",
          setDateRange: () => {},
          customStart,
          setCustomStart,
          customEnd,
          setCustomEnd,
        }}
      />
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
                width: "90%",
                marginBottom: 18,
                borderRadius: 18,
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
