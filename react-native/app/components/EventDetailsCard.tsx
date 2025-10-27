import Flag from "@/components/Flag"
import type { Event } from "@/interfaces/event"
import { FontAwesome6 } from "@expo/vector-icons"
import dayjs from "dayjs"
import { Linking, Platform, TouchableOpacity, View } from "react-native"
import { Divider, Text, useTheme } from "react-native-paper"

interface Props {
  event: Event
  onUnsubscribe?: (event: Event) => void
  onSeeMore?: (event: Event) => void
  actionButtons?: boolean
}

export default function EventDetailsCard({ event, onUnsubscribe, onSeeMore, actionButtons }: Props) {
  const theme = useTheme()
  const iconColor = theme.colors.primary
  const textColor = theme.colors.onBackground
  const rowStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 8,
  }
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "90%",
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
        <View style={{ width: 1, height: 40, backgroundColor: theme.colors.shadow, marginHorizontal: 0 }} />
        {/* Theme */}
        {event.theme && (
          <View style={rowStyle}>
            <FontAwesome6 name={event.theme.icon} size={20} color={iconColor} style={{ marginRight: 12 }} />
            <Text style={{ color: textColor, fontSize: 16 }}>
              {event.theme.name.split("")[0].toUpperCase() + event.theme.name.slice(1)}
            </Text>
          </View>
        )}
        <View style={{ width: 1, height: 40, backgroundColor: theme.colors.shadow, marginHorizontal: 0 }} />
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
        <Divider style={{ marginVertical: 4, backgroundColor: theme.colors.shadow, height: 1 }} />
        {/* Location */}
        {event.city && event.address && (
          <>
            <View style={{ ...rowStyle, flexDirection: "row", alignItems: "center", gap: 6 }}>
              <FontAwesome6 name="location-dot" size={20} color={iconColor} style={{ marginRight: 12 }} />
              <Text
                style={{ color: textColor, fontSize: 16, textDecorationLine: "underline" }}
                selectable
                selectionColor={theme.colors.primary}
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
            <Divider style={{ marginVertical: 4, backgroundColor: theme.colors.shadow, height: 1 }} />
          </>
        )}
        {/* Venue */}
        {event.venue && (
          <>
            <View style={{ ...rowStyle, flexDirection: "row", alignItems: "center", gap: 6 }}>
              <FontAwesome6 name="building" size={20} color={iconColor} style={{ marginRight: 12 }} />
              <Text style={{ color: textColor, fontSize: 16 }} selectable selectionColor={theme.colors.primary}>
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
            <Divider style={{ marginVertical: 4, backgroundColor: theme.colors.shadow, height: 1 }} />
          </>
        )}
        {/* Start Time */}
        <>
          <View style={rowStyle}>
            <FontAwesome6 name="calendar" size={20} color={iconColor} style={{ marginRight: 12 }} />
            <Text style={{ color: textColor, fontSize: 16 }}>{dayjs(event.startAt).format("DD MMMM YYYY")}</Text>
          </View>
          <Divider style={{ marginVertical: 4, backgroundColor: theme.colors.shadow, height: 1 }} />
        </>
        {/* Start hour */}
        <>
          <View style={rowStyle}>
            <FontAwesome6 name="clock" size={20} color={iconColor} style={{ marginRight: 12 }} />
            <Text style={{ color: textColor, fontSize: 16 }}>{dayjs(event.startAt).format("HH:mm")}</Text>
          </View>
          <Divider style={{ marginVertical: 4, backgroundColor: "transparent", height: 1 }} />
        </>
      </View>
      {/* Action Buttons as Card Bottom */}
      {actionButtons && (
        <View style={{ flexDirection: "row", width: "100%", height: 52, margin: 0, padding: 0 }}>
          {onUnsubscribe ? (
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: theme.colors.error,
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
              onPress={() => onUnsubscribe(event)}
            >
              <Text style={{ color: theme.colors.onError, fontWeight: "bold", fontSize: 16 }}>Unsubscribe</Text>
            </TouchableOpacity>
          ) : null}
          {/* Divider between buttons */}
          {onUnsubscribe && onSeeMore ? (
            <View style={{ width: 0.5, height: "100%", backgroundColor: theme.colors.shadow, margin: 0, padding: 0 }} />
          ) : null}
          {onSeeMore ? (
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: theme.colors.primary,
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
              onPress={() => onSeeMore(event)}
            >
              <Text style={{ color: theme.colors.onError, fontWeight: "bold", fontSize: 16 }}>See More</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  )
}
