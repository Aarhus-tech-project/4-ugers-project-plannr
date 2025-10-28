import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import { mockProfile } from "@/data/mockProfile.data"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useRef } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"
import EventDetailsCard from "../components/EventDetailsCard"

export default function Home() {
  const theme = useCustomTheme()
  const bg = theme.colors.background
  const { likedEvents = [] } = mockProfile
  const sortedEvents = [...likedEvents].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
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
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: bg,
        }}
      >
        <ScrollView
          style={{ flex: 1, width: "100%", paddingTop: 16 }}
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
          {sortedEvents.length > 0 && (
            <View style={{ width: "100%", marginBottom: 18 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  marginLeft: 24,
                  marginBottom: 10,
                  color: theme.colors.onBackground,
                }}
              >
                Upcoming Events
              </Text>
              {sortedEvents.map((event) => (
                <View key={event.id} style={{ alignItems: "center", marginBottom: 16, width: "100%" }}>
                  <EventDetailsCard
                    event={event}
                    onUnsubscribe={() => {
                      /* TODO: Unsubscribe logic */
                    }}
                    actionButtons={true}
                    onSeeMore={() => router.push(`/event/${event.id}`)}
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  )
}
