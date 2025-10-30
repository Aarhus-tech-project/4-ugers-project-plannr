import { useTabBarVisibility } from "@/context/TabBarVisibilityContext"
import mockEvents from "@/data/mockEvents.data"
import { getSortedEventCards } from "@/utils/event-content"

import EventImageGallery from "@/components/EventImageGallery"
import MapViewer from "@/components/MapViewer"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { MotiView } from "moti"
import { useRef, useState } from "react"
import { Image, Linking, ScrollView, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"
import EventDetailsCard from "../../components/EventDetailsCard"

export default function Finder() {
  const theme = useCustomTheme()
  const bg = theme.colors.background
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
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 4, borderRadius: 16, position: "absolute", left: 20, top: 52 }}
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: bg,
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
              style={{ flex: 1, width: "100%", paddingTop: 8 }}
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
              <EventImageGallery event={event} theme={theme} />
              {cards?.map((card, idx) => {
                if (card.type === "details") {
                  return (
                    <View key={idx} style={{ width: "90%", flex: 1, marginVertical: 8 }}>
                      <EventDetailsCard key={idx} event={event} />
                    </View>
                  )
                } else if (card.type === "section") {
                  const section = card.section
                  if (!section) return null
                  // Render different section types with type guards
                  if (section.type === "description") {
                    return (
                      <View
                        key={idx}
                        style={{
                          width: "90%",
                          borderRadius: 16,
                          backgroundColor: theme.colors.secondary,
                          padding: 24,
                          paddingHorizontal: 24,
                          paddingVertical: 16,
                          marginVertical: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.colors.onBackground,
                            fontSize: 18,
                            fontWeight: "bold",
                            marginBottom: 8,
                          }}
                        >
                          Description
                        </Text>
                        <Text style={{ color: theme.colors.onBackground, fontSize: 16 }}>{section.content}</Text>
                      </View>
                    )
                  }
                  if (section.type === "faq") {
                    return (
                      <View
                        key={idx}
                        style={{
                          width: "90%",
                          borderRadius: 16,
                          backgroundColor: theme.colors.secondary,
                          padding: 24,
                          marginVertical: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.colors.onBackground,
                            fontSize: 18,
                            fontWeight: "bold",
                            marginBottom: 8,
                          }}
                        >
                          FAQ
                        </Text>
                        {(section.items as { question: string; answer: string }[]).map((item, i) => (
                          <View key={i} style={{ marginBottom: 10 }}>
                            <Text style={{ color: theme.colors.onBackground, fontWeight: "bold" }}>
                              {item.question}
                            </Text>
                            <Text style={{ color: theme.colors.onBackground }}>{item.answer}</Text>
                          </View>
                        ))}
                      </View>
                    )
                  }
                  // Guests section
                  if (section.type === "guests") {
                    return (
                      <View
                        key={idx}
                        style={{
                          width: "90%",
                          borderRadius: 16,
                          backgroundColor: theme.colors.secondary,
                          padding: 24,
                          marginVertical: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.colors.onBackground,
                            fontSize: 18,
                            fontWeight: "bold",
                            marginBottom: 8,
                          }}
                        >
                          Special Guests
                        </Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ flexDirection: "row", alignItems: "flex-start" }}
                          style={{ width: "100%" }}
                        >
                          {section.guests.map((guest, i) => {
                            const textColor = theme.colors.onSecondary
                            return (
                              <View
                                key={i}
                                style={{
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginRight: 16,
                                  marginBottom: 0,
                                  width: 110,
                                  height: 170,
                                  padding: 0,
                                  backgroundColor: theme.colors.background,
                                  borderRadius: 18,
                                  overflow: "hidden",
                                }}
                              >
                                {/* Colored top bar */}
                                <View
                                  style={{
                                    width: "100%",
                                    height: 8,
                                    borderTopLeftRadius: 18,
                                    borderTopRightRadius: 18,
                                  }}
                                />
                                <View style={{ alignItems: "center", marginTop: 8 }}>
                                  {guest.avatarUrl ? (
                                    <View
                                      style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 32,
                                        borderWidth: 2,
                                        borderColor: theme.colors.brand.red, // visible primary border
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: 6,
                                      }}
                                    >
                                      <View
                                        style={{
                                          width: 60,
                                          height: 60,
                                          borderRadius: 30,
                                          borderWidth: 2,
                                          borderColor: "transparent", // invisible outer border
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <Image
                                          source={{ uri: guest.avatarUrl }}
                                          style={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 28,
                                          }}
                                        />
                                      </View>
                                    </View>
                                  ) : (
                                    <View
                                      style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 32,
                                        borderWidth: 2,
                                        borderColor: theme.colors.brand.red, // visible primary border
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: 6,
                                      }}
                                    >
                                      <View
                                        style={{
                                          width: 60,
                                          height: 60,
                                          borderRadius: 30,
                                          borderWidth: 2,
                                          borderColor: "transparent", // invisible outer border
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <FontAwesome6 name="user" size={30} color={theme.colors.brand.red} />
                                      </View>
                                    </View>
                                  )}
                                </View>
                                <View
                                  style={{
                                    flex: 1,
                                    width: "100%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    paddingHorizontal: 6,
                                  }}
                                >
                                  <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={{
                                      color: textColor,
                                      fontWeight: "bold",
                                      textAlign: "center",
                                      width: "100%",
                                      fontSize: 15,
                                    }}
                                  >
                                    {guest.name}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    minHeight: 36,
                                    width: "100%",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    paddingHorizontal: 6,
                                    marginBottom: 8,
                                  }}
                                >
                                  {guest.bio && (
                                    <Text
                                      numberOfLines={2}
                                      ellipsizeMode="tail"
                                      style={{
                                        color: textColor,
                                        fontSize: 12,
                                        textAlign: "center",
                                        width: "100%",
                                        marginTop: 2,
                                      }}
                                    >
                                      {guest.bio}
                                    </Text>
                                  )}
                                </View>
                              </View>
                            )
                          })}
                        </ScrollView>
                      </View>
                    )
                  }
                  // Tickets section
                  if (section.type === "tickets") {
                    // Only render if all tickets have a link
                    if (!section.tickets.every((ticket) => !!ticket.link)) {
                      return null
                    }
                    return (
                      <View
                        key={idx}
                        style={{
                          width: "90%",
                          borderRadius: 20,
                          backgroundColor: theme.colors.secondary,
                          padding: 24,
                          borderWidth: 2,
                          borderColor: theme.colors.brand.red,
                          marginVertical: 8,
                        }}
                      >
                        {/* Ticket badge icon */}
                        <View
                          style={{
                            position: "absolute",
                            top: 12,
                            right: 16,
                            zIndex: 2,
                            backgroundColor: theme.colors.brand.red,
                            borderRadius: 16,
                            padding: 6,
                          }}
                        >
                          <FontAwesome6 name="ticket" size={18} color={theme.colors.background} />
                        </View>
                        <Text
                          style={{
                            color: theme.colors.onBackground,
                            fontSize: 20,
                            fontWeight: "bold",
                            marginBottom: 8,
                            letterSpacing: 1,
                          }}
                        >
                          Tickets
                        </Text>
                        {section.tickets.map((ticket, i) => (
                          <View
                            key={i}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 14,
                              backgroundColor: theme.colors.background,
                              borderRadius: 14,
                              paddingVertical: 12,
                              paddingHorizontal: 16,
                            }}
                          >
                            <FontAwesome6
                              name="ticket"
                              size={20}
                              color={theme.colors.brand.red}
                              style={{ marginRight: 12 }}
                            />
                            <View style={{ flex: 1 }}>
                              <Text style={{ color: theme.colors.onBackground, fontWeight: "bold", fontSize: 16 }}>
                                {ticket.type}
                              </Text>
                              <Text style={{ color: theme.colors.onSurface, fontSize: 14, marginTop: 2 }}>
                                {ticket.price > 0 ? `${ticket.price} DKK` : "Free"}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => ticket.link && Linking.openURL(ticket.link)}
                              style={{
                                backgroundColor: theme.colors.brand.red,
                                borderRadius: 20,
                                paddingVertical: 8,
                                paddingHorizontal: 18,
                                flexDirection: "row",
                                alignItems: "center",
                                marginLeft: 10,
                              }}
                            >
                              <FontAwesome6
                                name="cart-shopping"
                                size={15}
                                color={theme.colors.background}
                                style={{ marginRight: 6 }}
                              />
                              <Text style={{ color: theme.colors.background, fontWeight: "bold", fontSize: 15 }}>
                                Buy
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )
                  }
                  // Resources section
                  if (section.type === "resources") {
                    return (
                      <View
                        key={idx}
                        style={{
                          width: "90%",
                          borderRadius: 16,
                          backgroundColor: theme.colors.secondary,
                          padding: 24,
                          marginVertical: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.colors.onBackground,
                            fontSize: 18,
                            fontWeight: "bold",
                            marginBottom: 8,
                          }}
                        >
                          Resources
                        </Text>
                        {section.files.map((file, i) => (
                          <TouchableOpacity
                            key={i}
                            onPress={() => Linking.openURL(file.url)}
                            style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
                          >
                            <FontAwesome6
                              name="file"
                              size={18}
                              color={theme.colors.brand.red}
                              style={{ marginRight: 10 }}
                            />
                            <Text style={{ color: theme.colors.brand.red, textDecorationLine: "underline" }}>
                              {file.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )
                  }
                  if (section.type === "location") {
                    return (
                      <View
                        key={idx}
                        style={{
                          width: "90%",
                          borderRadius: 16,
                          backgroundColor: theme.colors.secondary,
                          padding: 24,
                          marginVertical: 8,
                          marginBottom: 24,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.colors.onBackground,
                            fontSize: 18,
                            fontWeight: "bold",
                            marginBottom: 8,
                          }}
                        >
                          Location
                        </Text>
                        <Text style={{ color: theme.colors.onBackground, fontSize: 16 }}>{section.address}</Text>
                        <View style={{ position: "relative" }}>
                          <MapViewer
                            location={{
                              latitude: section.latitude || 0,
                              longitude: section.longitude || 0,
                            }}
                            markerTitle={event.title}
                            markerDescription={section.address}
                            style={{ marginTop: 12 }}
                          />
                        </View>
                      </View>
                    )
                  }
                  return null
                }
                return null
              })}
            </ScrollView>
          </View>
        ) : (
          <Text>No more events</Text>
        )}
        {/* Sticky Buttons */}
        <MotiView
          style={{ position: "absolute", right: 24 }}
          animate={{ bottom: visible ? 96 : 48 }}
          transition={{ type: "timing", duration: 150 }}
        >
          <TouchableOpacity onPress={acceptEvent} activeOpacity={1}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: theme.colors.brand.red,
                justifyContent: "center",
                alignItems: "center",
                elevation: 3,
              }}
            >
              <FontAwesome6 name="heart" size={32} color={theme.colors.secondary} />
            </View>
          </TouchableOpacity>
        </MotiView>
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
                elevation: 3,
              }}
            >
              <FontAwesome6 name="xmark" size={32} color={theme.colors.brand.red} />
            </View>
          </TouchableOpacity>
        </MotiView>
      </View>
    </>
  )
}
