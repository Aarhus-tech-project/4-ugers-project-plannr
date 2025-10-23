import { mockEvents } from "@/data/mockEvents.data"
import type { Event } from "@/interfaces/event"
import EventDetailsCard from "@components/EventDetailsCard"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Image, ScrollView, TouchableOpacity, View } from "react-native"
import { Surface, Text, useTheme } from "react-native-paper"

export default function Finder() {
  const theme = useTheme()
  const bg = theme.colors.background
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const event = mockEvents[current]
  const nextEvent = () => {
    setCurrent((prev) => (prev + 1 < mockEvents.length ? prev + 1 : 0))
  }
  const denyEvent = () => nextEvent()
  const acceptEvent = () => nextEvent()
  // Compose cards: images and prompts, randomly interleaved
  type Card =
    | { type: "image"; src: string }
    | { type: "prompt"; prompt: string; answer: string }
    | { type: "details"; event: Event }
  function shuffle<T>(array: T[]): T[] {
    let arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }
  let cards: Card[] = []
  if (event) {
    const images = event.images.map((img) => ({ type: "image" as const, src: img?.src }))
    const prompts = shuffle(event.prompts.map((p) => ({ type: "prompt" as const, prompt: p.prompt, answer: p.answer })))
    // Always start with a picture
    if (images.length > 0) cards.push(images?.[0])
    // Insert event details card as the second card
    cards.push({ type: "details", event })
    let promptIdx = 0
    // Alternate: 2 prompts, then a picture, repeat
    for (let i = 1; i < images.length; i++) {
      for (let j = 0; j < 2 && promptIdx < prompts.length; j++, promptIdx++) {
        cards.push(prompts[promptIdx])
      }
      cards.push(images[i])
    }
    // Add any remaining prompts
    while (promptIdx < prompts.length) {
      cards.push(prompts[promptIdx++])
    }
  }

  return (
    <Surface
      style={{
        flex: 1,
        backgroundColor: bg,
        elevation: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          top: 40,
          paddingVertical: 10,
          left: "5%",
          right: "5%",
          height: "auto",
          zIndex: 10,
          width: "90%",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 4, borderRadius: 20, position: "absolute", left: 0, zIndex: 100 }}
          activeOpacity={0.6}
        >
          <FontAwesome6 name="arrow-left" size={28} color={theme.colors.onBackground} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text
            variant="titleLarge"
            style={{ color: theme.colors.onBackground, fontWeight: "bold", textAlign: "center" }}
          >
            {event.title}
          </Text>
        </View>
      </View>

      {event ? (
        <View
          style={{
            flex: 1,
            width: "100%",

            marginTop: 90,
          }}
        >
          {/* Scrollable cards below header */}
          <ScrollView
            style={{ flex: 1, width: "100%", paddingTop: 0 }}
            contentContainerStyle={{ alignItems: "center" }}
            showsVerticalScrollIndicator={false}
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
                    source={{ uri: card.src }}
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
                        elevation: 4,
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
                        fontStyle: "italic",
                        fontSize: 16,
                        textAlign: "center",
                        marginBottom: 8,
                      }}
                    >
                      {card.prompt}
                    </Text>
                    <Text
                      style={{
                        color: theme.colors.onBackground,
                        fontSize: 24,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {card.answer}
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
                        elevation: 4,
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
      <TouchableOpacity style={{ position: "absolute", left: 24, bottom: 52 }} onPress={denyEvent}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: theme.colors.secondary,
            justifyContent: "center",
            alignItems: "center",
            elevation: 4,
            shadowOpacity: 0.5,
            shadowOffset: { width: 0, height: 0 },
            shadowColor: theme.colors.shadow,
          }}
        >
          <FontAwesome6 name="xmark" size={32} color={theme.colors.onBackground} />
        </View>
      </TouchableOpacity>
    </Surface>
  )
}
