import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FontAwesome6 } from "@expo/vector-icons"
import React from "react"
import { FlatList, Image, Platform, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

export interface EventsCarouselProps {
  data: any[]
  title?: string
  liveLocation?: { coords: { latitude: number; longitude: number } }
  onEventPress?: (event: any) => void
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const EventsCarousel: React.FC<EventsCarouselProps> = ({ data, title, liveLocation, onEventPress }) => {
  const theme = useCustomTheme()
  if (!data || data.length === 0) return null
  return (
    <View style={{ width: "100%", marginTop: 10 }}>
      {title && (
        <Text
          style={{
            color: theme.colors.onBackground,
            fontWeight: "bold",
            fontSize: 18,
            marginLeft: 16,
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
      )}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 210 }}
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onEventPress && onEventPress(item)}
            style={{
              borderRadius: 16,
              width: 160,
              backgroundColor: theme.colors.secondary,
              overflow: "hidden",
              ...(Platform.OS === "web" ? { backdropFilter: "blur(16px)" } : {}),
            }}
          >
            {/* Event image with gradient overlay */}
            <View style={{ position: "relative" }}>
              {item.sections?.find((s: any) => s.type === "images")?.srcs?.[0] ? (
                <Image
                  source={{ uri: item.sections.find((s: any) => s.type === "images")?.srcs?.[0] }}
                  style={{
                    width: 160,
                    height: 90,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    resizeMode: "cover",
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 160,
                    height: 90,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    backgroundColor: theme.colors.secondary,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome6 name="calendar" size={32} color={theme.colors.brand.red} />
                </View>
              )}
            </View>
            {/* Card content */}
            <View style={{ padding: 12, paddingTop: 10 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: theme.colors.onBackground,
                  marginBottom: 4,
                  letterSpacing: 0.1,
                }}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              {item.theme?.name && (
                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 4, marginBottom: 4 }}>
                  <FontAwesome6
                    name={item.theme.icon || "tag"}
                    size={12}
                    color={theme.colors.brand.red}
                    style={{ marginRight: 2, width: 12 }}
                  />
                  <Text
                    style={{
                      color: theme.colors.brand.red,
                      backgroundColor: theme.colors.brand.red + "22",
                      borderRadius: 8,
                      paddingHorizontal: 7,
                      fontWeight: "bold",
                      fontSize: 13,
                      marginRight: 8,
                      marginLeft: 2,
                    }}
                  >
                    {item.theme.name}
                  </Text>
                </View>
              )}
              {liveLocation && (
                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 4 }}>
                  <FontAwesome6
                    name="location-arrow"
                    size={12}
                    color={theme.colors.brand.blue}
                    style={{ marginRight: 2, width: 12 }}
                  />
                  <Text
                    style={{
                      color: theme.colors.brand.blue,
                      backgroundColor: theme.colors.brand.blue + "22",
                      borderRadius: 8,
                      paddingHorizontal: 7,
                      fontWeight: "bold",
                      fontSize: 13,
                      marginRight: 8,
                      marginLeft: 2,
                    }}
                  >
                    {getDistanceFromLatLonInKm(
                      liveLocation.coords.latitude,
                      liveLocation.coords.longitude,
                      item.location?.latitude ?? 0,
                      item.location?.longitude ?? 0
                    ).toFixed(1)}
                    km
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
