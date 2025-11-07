import EventDetailsCard from "@/components/EventDetailsCard"
import { useAppData } from "@/context/AppDataContext"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import { router } from "expo-router"
import React, { useEffect } from "react"
import { ScrollView, Text, View } from "react-native"

export default function OwnEvents() {
  const theme = useCustomTheme()
  const bg = theme.colors.background
  const { events, fetchEvents, deleteEvent } = useAppData()

  const ownEvents = events.filter((event) => event.creatorId === (useAppData().session?.profile.id ?? ""))

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleDelete = (id: string) => {
    deleteEvent(id)
  }

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          paddingTop: 80,
          paddingBottom: 16,
          backgroundColor: theme.colors.secondary,
        }}
      >
        <Text
          style={{
            color: theme.colors.onBackground,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 32,
            left: 40,
          }}
        >
          Your Events
        </Text>
      </View>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: bg,
          width: "100%",
          borderRadius: 16,
          padding: 24,
          paddingHorizontal: 24,
          paddingVertical: 16,
          marginVertical: 8,
          alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {ownEvents.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 48 }}>
            <FontAwesome6 name="calendar" size={48} color={theme.colors.gray[400]} />
            <Text style={{ color: theme.colors.gray[400], fontSize: 18, marginTop: 12 }}>
              You haven't created any events yet.
            </Text>
          </View>
        ) : (
          ownEvents.map((event) => {
            if (!event.id) return null
            return (
              <View key={event.id} style={{ marginBottom: 18 }}>
                <EventDetailsCard
                  event={event}
                  buttons={[
                    {
                      label: "Edit",
                      icon: "pen-to-square",
                      backgroundColor: theme.colors.brand.red,
                      textColor: theme.colors.white,
                      onPress: () => router.push({ pathname: "/create", params: { event: JSON.stringify(event) } }),
                    },
                    {
                      label: "Delete",
                      icon: "trash",
                      backgroundColor: theme.colors.gray[700],
                      textColor: theme.colors.white,
                      onPress: () => handleDelete(event.id!),
                    },
                  ]}
                />
              </View>
            )
          })
        )}
      </ScrollView>
    </View>
  )
}
