import Flag from "@/components/Flag"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import type { Event } from "@/interfaces/event"
import { FontAwesome6 } from "@expo/vector-icons"
import dayjs from "dayjs"
import { Linking, Platform, TouchableOpacity, View } from "react-native"
import { Divider, Text } from "react-native-paper"

import type { Profile } from "@/interfaces/profile"

interface Props {
  event: Event
  profile: Profile
  onSubscribe?: (event: Event) => void
  onSeeMore?: (event: Event) => void
  actionButtons?: boolean
}

export default function EventDetailsCard({ event, profile, onSubscribe, onSeeMore, actionButtons }: Props) {
  const theme = useCustomTheme()
  const iconColor = theme.colors.brand.red
  const textColor = theme.colors.onBackground
  const rowStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 8,
  }
  const isSubscribed = profile?.subscribedEvents?.some((e) => e.id === event.id)
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        borderRadius: 16,
        backgroundColor: theme.colors.secondary,
        marginBottom: 24,
      }}
    >
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "flex-start",
          borderRadius: 16,
          paddingTop: 16,
          paddingBottom: 8,
          paddingHorizontal: 16,
          gap: 16,
        }}
      >
        {/* Interested Count */}
        <View style={rowStyle}>
          <FontAwesome6 name="users" size={20} color={iconColor} style={{ marginRight: 12 }} />
          <Text style={{ color: textColor, fontSize: 16 }}>{event.interestedCount}</Text>
        </View>
        <View style={{ width: 0.5, height: 40, backgroundColor: theme.colors.shadow, marginHorizontal: 0 }} />
        {/* Theme */}
        {event.theme && (
          <View style={rowStyle}>
            <FontAwesome6 name={event.theme.icon} size={20} color={iconColor} style={{ marginRight: 12 }} />
            <Text style={{ color: textColor, fontSize: 16 }}>
              {event.theme.name.split("")[0].toUpperCase() + event.theme.name.slice(1)}
            </Text>
          </View>
        )}
        <View style={{ width: 0.5, height: 40, backgroundColor: theme.colors.shadow, marginHorizontal: 0 }} />
        {/* Country */}
        {event.country && (
          <View style={{ ...rowStyle, flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Flag cca2={event?.country} />
            <Text style={{ color: textColor, fontSize: 16 }}>{event.country}</Text>
          </View>
        )}
      </View>

      <View
        style={{
          width: "100%",
          paddingHorizontal: 16,
        }}
      >
        <Divider style={{ marginBottom: 4, backgroundColor: theme.colors.shadow, height: 0.5 }} />
        {/* Location */}
        {event.city && event.address && (
          <>
            <View style={{ ...rowStyle, flexDirection: "row", alignItems: "center", gap: 6 }}>
              <FontAwesome6 name="location-dot" size={20} color={iconColor} style={{ marginRight: 12 }} />
              <Text
                style={{ color: textColor, fontSize: 16, textDecorationLine: "underline" }}
                selectable
                selectionColor={theme.colors.brand.red}
                onPress={() => {
                  if (!event.address && !event.city) return
                  const query = encodeURIComponent(`${event.address}, ${event.city}`)
                  const url = Platform.select({
                    ios: `http://maps.apple.com/?q=${query}`,
                    android: `geo:0,0?q=${query}`,
                    default: `https://www.google.com/maps/search/?api=1&query=${query}`,
                  })
                  Linking.openURL(url as string)
                }}
              >
                {event.city}, {event.address}
              </Text>
            </View>
            <Divider style={{ marginVertical: 4, backgroundColor: theme.colors.shadow, height: 0.5 }} />
          </>
        )}
        {/* Venue */}
        {event.venue && (
          <>
            <View style={{ ...rowStyle, flexDirection: "row", alignItems: "center", gap: 6 }}>
              <FontAwesome6 name="building" size={20} color={iconColor} style={{ marginRight: 12 }} />
              <Text style={{ color: textColor, fontSize: 16 }} selectable selectionColor={theme.colors.brand.red}>
                {event.venue}
              </Text>
            </View>
            <Divider style={{ marginVertical: 4, backgroundColor: theme.colors.shadow, height: 1 }} />
          </>
        )}
        {/* Age Restriction */}
        {event.requiredAge && (
          <>
            <View style={rowStyle}>
              <FontAwesome6 name="user-shield" size={20} color={iconColor} style={{ marginRight: 12 }} />
              <Text style={{ color: textColor, fontSize: 16 }}>Age limit {event.requiredAge}+</Text>
            </View>
            <Divider style={{ marginVertical: 4, backgroundColor: theme.colors.shadow, height: 0.5 }} />
          </>
        )}
        {/* Start Time */}
        <>
          <View style={rowStyle}>
            <FontAwesome6 name="calendar" size={20} color={iconColor} style={{ marginRight: 12 }} />
            <Text style={{ color: textColor, fontSize: 16 }}>{dayjs(event.startAt).format("DD MMMM YYYY")}</Text>
          </View>
          <Divider style={{ marginVertical: 4, backgroundColor: theme.colors.shadow, height: 0.5 }} />
        </>
        {/* Start hour */}
        <>
          <View style={rowStyle}>
            <FontAwesome6 name="clock" size={20} color={iconColor} style={{ marginRight: 12 }} />
            <Text style={{ color: textColor, fontSize: 16 }}>{dayjs(event.startAt).format("HH:mm")}</Text>
          </View>
          <Divider style={{ marginVertical: 4, backgroundColor: "transparent", height: 0.5 }} />
        </>
      </View>
      {actionButtons && (
        <View style={{ flexDirection: "row", width: "100%", height: 42, margin: 0, padding: 0 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: isSubscribed ? theme.colors.brand.blue : theme.colors.brand.red,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              margin: 0,
              padding: 0,
            }}
            onPress={() => onSubscribe?.(event)}
          >
            <Text style={{ color: theme.colors.white, fontWeight: "bold", fontSize: 16 }}>
              {isSubscribed ? "I'm not going" : "I'm going"}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: 1,
              height: "100%",
              backgroundColor: theme.colors.brand.red,
              opacity: 0.7,
              margin: 0,
              padding: 1,
            }}
          />
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: theme.colors.brand.red,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 16,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              margin: 0,
              padding: 0,
            }}
            onPress={() => onSeeMore?.(event)}
          >
            <Text style={{ color: theme.colors.white, fontWeight: "bold", fontSize: 16 }}>See More</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
