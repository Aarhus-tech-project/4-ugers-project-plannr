import EventDetailsCard from "@/components/EventDetailsCard"
import EventImageGallery from "@/components/EventImageGallery"
import MapViewer from "@/components/MapViewer"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { Event } from "@/interfaces/event"
import { getSortedEventCards } from "@/utils/event-content"
import { FontAwesome6 } from "@expo/vector-icons"
import React from "react"
import { Animated, Image, Linking, ScrollView, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

interface EventPageProps {
  event: any
  onScroll?: any
  scrollY?: any
  showHeader?: boolean
  headerTitle?: string
  showActions?: boolean
}

const EventPage: React.FC<EventPageProps> = ({
  event,
  onScroll,
  showHeader = true,
  headerTitle,
}: {
  event: Event
  onScroll?: () => void
  showHeader?: boolean
  headerTitle?: string
}) => {
  const theme = useCustomTheme()
  const bg = theme.colors.background
  const cards = event ? getSortedEventCards(event) : []

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {showHeader && (
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
              paddingHorizontal: 16,
              maxWidth: "100%",
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {headerTitle || event?.title}
          </Text>
        </View>
      )}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: bg,
        }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          <Animated.ScrollView
            style={{ flex: 1, width: "100%", paddingTop: 8 }}
            contentContainerStyle={{ alignItems: "center" }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={8}
            onScroll={onScroll}
            bounces={false}
            overScrollMode="never"
            alwaysBounceVertical={false}
            contentInsetAdjustmentBehavior="never"
          >
            <EventImageGallery
              images={
                event?.sections
                  ?.filter((section) => section.type === "images")
                  .flatMap((section) =>
                    section.type === "images" && Array.isArray(section.srcs)
                      ? section.srcs.filter((src) => typeof src === "string")
                      : []
                  ) ?? []
              }
            />
            {cards?.map((card: any, idx: number) => {
              if (card.type === "details") {
                return (
                  <View key={idx} style={{ width: "90%", flex: 1, marginVertical: 8 }}>
                    <EventDetailsCard key={idx} event={event} />
                  </View>
                )
              } else if (card.type === "section") {
                const section = card.section
                if (!section) return null
                // --- Section rendering logic copied from Finder ---
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
                        bounces={false}
                        overScrollMode="never"
                        alwaysBounceVertical={false}
                        contentInsetAdjustmentBehavior="never"
                      >
                        {section.guests.map((guest: any, i: number) => {
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
                                padding: 8,
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
                                      borderColor: theme.colors.brand.red,
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
                                        borderColor: "transparent",
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
                                      borderColor: theme.colors.brand.red,
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
                                        borderColor: "transparent",
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
                if (section.type === "schedule") {
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
                        Schedule
                      </Text>
                      {section.items.map((item: any, i: number) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 10,
                          }}
                        >
                          <Text
                            style={{
                              color: theme.colors.brand.red,
                              fontWeight: "bold",
                              width: 100,
                            }}
                          >
                            {item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </Text>
                          <Text style={{ color: theme.colors.onBackground }}>{item.activity}</Text>
                        </View>
                      ))}
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
                          <Text style={{ color: theme.colors.onBackground, fontWeight: "bold" }}>{item.question}</Text>
                          <Text style={{ color: theme.colors.onBackground }}>{item.answer}</Text>
                        </View>
                      ))}
                    </View>
                  )
                }
                if (section.type === "tickets") {
                  if (!section.tickets.every((ticket: any) => !!ticket.link)) {
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
                      {section.tickets.map((ticket: any, i: number) => (
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
                      {section.files.map((file: any, i: number) => (
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
                if (section.type === "map") {
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
                      <View style={{ position: "relative" }}>
                        <MapViewer
                          location={{
                            latitude: section.latitude || 0,
                            longitude: section.longitude || 0,
                          }}
                          markerTitle={event.title}
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
          </Animated.ScrollView>
        </View>
      </View>
    </View>
  )
}

export default EventPage
