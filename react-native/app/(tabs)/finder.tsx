import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import mockEvents from "@/data/mockEvents.data"
import { getSortedEventCards } from "@/utils/event-content"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { MotiView } from "moti"
import { useRef, useState } from "react"
import { Image, ScrollView, TouchableOpacity, View } from "react-native"
import { Surface, Text, useTheme } from "react-native-paper"
import EventDetailsCard from "../components/EventDetailsCard"

export default function Finder() {
  const theme = useTheme()
  const router = useRouter()
  const { setVisible, visible } = useTabBarVisibility()
  const lastScrollY = useRef(0)

  // Track current event index
  const [current, setCurrent] = useState(0)
  const event = mockEvents[current]
  const cards = event ? getSortedEventCards(event) : []

  // Navigation logic
  const nextEvent = () => {
    setCurrent((prev) => (prev + 1 < mockEvents.length ? prev + 1 : 0))
  }
  const denyEvent = () => nextEvent()
  const acceptEvent = () => nextEvent()

  return (
    <>
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
          {event?.title}
        </Text>
      </View>
      <Surface
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {event ? (
          <View
            style={{
              flex: 1,
              width: "100%",
            }}
          >
            <ScrollView
              style={{ flex: 1, width: "100%", paddingTop: 16 }}
              contentContainerStyle={{ alignItems: "center" }}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={8}
              onScroll={(e) => {
                const currentY = e.nativeEvent.contentOffset.y
                if (currentY > lastScrollY.current + 10) {
                  setVisible(false) // scrolling down
                } else if (currentY < lastScrollY.current - 10) {
                  setVisible(true) // scrolling up
                }
                lastScrollY.current = currentY
              }}
            >
              {cards?.map((card, idx) =>
                card.type === "image" ? (
                  <View
                    key={idx}
                    style={{
                      width: "90%",
                      minHeight: 120,
                      borderRadius: 16,
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 0,
                      marginBottom: 24,
                      position: "relative",
                    }}
                  >
                    <Image
                      source={{ uri: card.image?.src }}
                      style={{
                        width: "100%",
                        height: 320,
                        borderRadius: 16,
                      }}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: 8,
                        bottom: 8,
                      }}
                      onPress={acceptEvent}
                    >
                      <View
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 30,
                          backgroundColor: theme.colors.secondary,
                          justifyContent: "center",
                          alignItems: "center",
                          shadowOpacity: 0.5,
                          shadowOffset: { width: 0, height: 0 },
                          shadowColor: theme.colors.shadow,
                        }}
                      >
                        <FontAwesome6 name="heart" size={24} color={theme.colors.onBackground} />
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : card.type === "details" ? (
                  <EventDetailsCard key={idx} event={event} />
                ) : (
                  <View
                    key={idx}
                    style={{
                      width: "90%",
                      borderRadius: 16,
                      backgroundColor: theme.colors.secondary,
                      marginBottom: 24,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 32,
                      position: "relative",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingHorizontal: 16,
                        marginVertical: 32,
                      }}
                    >
                      <Text
                        style={{
                          color: theme.colors.onBackground,
                          fontSize: 14,
                          textAlign: "center",
                          marginBottom: 8,
                        }}
                      >
                        {card.prompt?.prompt}
                      </Text>
                      <Text
                        style={{
                          color: theme.colors.onBackground,
                          fontSize: 24,
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {card.prompt?.answer}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: 8,
                        bottom: 8,
                      }}
                      onPress={acceptEvent}
                    >
                      <View
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 30,
                          backgroundColor: theme.colors.secondary,
                          justifyContent: "center",
                          alignItems: "center",
                          shadowOpacity: 0.5,
                          shadowOffset: { width: 0, height: 0 },
                          shadowColor: theme.colors.shadow,
                        }}
                      >
                        <FontAwesome6 name="heart" size={24} color={theme.colors.onBackground} />
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              )}
            </ScrollView>
          </View>
        ) : (
          <Text>No more events</Text>
        )}
        {/* Sticky Buttons */}
        <MotiView
          style={{ position: "absolute", left: 24 }}
          animate={{ bottom: visible ? 96 : 48 }}
          transition={{ type: "timing", duration: 150 }}
        >
          <TouchableOpacity onPress={denyEvent}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: theme.colors.secondary,
                justifyContent: "center",
                alignItems: "center",
                shadowOpacity: 0.5,
                shadowOffset: { width: 0, height: 0 },
                shadowColor: theme.colors.shadow,
              }}
            >
              <FontAwesome6 name="xmark" size={32} color={theme.colors.onBackground} />
            </View>
          </TouchableOpacity>
        </MotiView>
      </Surface>
    </>
  )
}
