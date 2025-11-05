import { useCustomTheme } from "@/hooks/useCustomTheme"
import { Event } from "@/interfaces/event"
import { FontAwesome6 } from "@expo/vector-icons"
import { router } from "expo-router"
import React, { useState } from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"

// TODO: Replace with real data fetching
const mockEvents: Event[] = [
  {
    creatorId: "123e4567-e89b-12d3-a456-426614174000",
    id: "evt1",
    title: "Test Event",
    themes: ["Adventure"],
    format: "inperson",
    dateRange: {
      startAt: new Date(),
      endAt: new Date(Date.now() + 86400000),
    },
    location: {
      address: "Julsøvej 8A",
      city: "Risskov",
      country: "Denmark",
      latitude: 56.2058,
      longitude: 10.251,
      venue: "Julsøvej 8A",
    },
    sections: [
      {
        type: "images",
        srcs: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb"],
      },
    ],
  },
]

export default function OwnEvents() {
  const theme = useCustomTheme()
  // TODO: Replace with real user events
  const [events, setEvents] = useState(mockEvents)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setDeleteId(null)
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 16 }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          color: theme.colors.onBackground,
          marginBottom: 18,
        }}
      >
        My Events
      </Text>
      {events.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 48 }}>
          <FontAwesome6 name="calendar" size={48} color={theme.colors.gray[400]} />
          <Text style={{ color: theme.colors.gray[400], fontSize: 18, marginTop: 12 }}>
            You haven't created any events yet.
          </Text>
        </View>
      ) : (
        events.map((event) => {
          if (!event.id) return null // Skip events without an id
          const imageSection = event.sections?.find(
            (s) => s.type === "images" && Array.isArray((s as any).srcs) && (s as any).srcs.length > 0
          )
          const imageSrc = imageSection && imageSection.type === "images" ? (imageSection as any).srcs[0] : undefined
          return (
            <View
              key={event.id}
              style={{
                backgroundColor: theme.colors.secondary,
                borderRadius: 18,
                marginBottom: 18,
                shadowColor: theme.colors.gray[900],
                shadowOpacity: 0.12,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
                overflow: "hidden",
              }}
            >
              {imageSrc ? (
                <Image
                  source={{ uri: imageSrc }}
                  style={{
                    width: "100%",
                    height: 160,
                    resizeMode: "cover",
                  }}
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: 160,
                    backgroundColor: theme.colors.gray[300],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome6 name="image" size={32} color={theme.colors.gray[400]} />
                </View>
              )}
              <View style={{ padding: 18 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "600",
                    color: theme.colors.onBackground,
                    marginBottom: 6,
                  }}
                >
                  {event.title}
                </Text>
                <Text
                  style={{
                    color: theme.colors.gray[600],
                    fontSize: 15,
                    marginBottom: 2,
                  }}
                >
                  {event.location?.address}, {event.location?.city}
                </Text>
                <Text
                  style={{
                    color: theme.colors.gray[500],
                    fontSize: 14,
                    marginBottom: 10,
                  }}
                >
                  {event.dateRange.startAt.toLocaleDateString()} - {event.dateRange.endAt?.toLocaleDateString()}
                </Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme.colors.brand.red,
                      borderRadius: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 18,
                      marginRight: 8,
                    }}
                    onPress={() => router.push({ pathname: "/create", params: { event: JSON.stringify(event) } })}
                  >
                    <Text
                      style={{
                        color: theme.colors.white,
                        fontWeight: "600",
                        fontSize: 16,
                      }}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme.colors.gray[700],
                      borderRadius: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 18,
                    }}
                    onPress={() => setDeleteId(event.id!)}
                  >
                    <Text
                      style={{
                        color: theme.colors.white,
                        fontWeight: "600",
                        fontSize: 16,
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {deleteId === event.id && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: theme.colors.gray[900] + "CC",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: theme.colors.secondary,
                      borderRadius: 12,
                      padding: 24,
                      alignItems: "center",
                      shadowColor: theme.colors.gray[900],
                      shadowOpacity: 0.18,
                      shadowRadius: 12,
                      elevation: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.colors.onBackground,
                        fontSize: 18,
                        fontWeight: "600",
                        marginBottom: 18,
                      }}
                    >
                      Delete this event?
                    </Text>
                    <View style={{ flexDirection: "row", gap: 16 }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: theme.colors.brand.red,
                          borderRadius: 8,
                          paddingVertical: 8,
                          paddingHorizontal: 18,
                          marginRight: 8,
                        }}
                        onPress={() => handleDelete(event.id!)}
                      >
                        <Text
                          style={{
                            color: theme.colors.white,
                            fontWeight: "600",
                            fontSize: 16,
                          }}
                        >
                          Delete
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: theme.colors.gray[700],
                          borderRadius: 8,
                          paddingVertical: 8,
                          paddingHorizontal: 18,
                        }}
                        onPress={() => setDeleteId(null)}
                      >
                        <Text
                          style={{
                            color: theme.colors.white,
                            fontWeight: "600",
                            fontSize: 16,
                          }}
                        >
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )
        })
      )}
    </ScrollView>
  )
}
