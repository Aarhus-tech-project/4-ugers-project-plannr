import type { Event } from "@/interfaces/event"
import { FontAwesome6 } from "@expo/vector-icons"
import dayjs from "dayjs"
import { Image, View } from "react-native"
import Flag from "react-native-ico-flags"
import { Divider, Text, useTheme } from "react-native-paper"

interface Props {
  event: Event
}

export default function EventDetailsCard({ event }: Props) {
  const theme = useTheme()
  const iconColor = theme.colors.onBackground
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
        paddingHorizontal: 16,
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
          gap: 16,
        }}
      >
        {/* Interested Count */}
        <View style={rowStyle}>
          <FontAwesome6 name="users" size={20} color={iconColor} style={{ marginRight: 12 }} />
          <Text style={{ color: iconColor, fontSize: 16 }}>{event.interestedCount}</Text>
        </View>
        <View style={{ width: 1, height: 40, backgroundColor: theme.colors.shadow, marginHorizontal: 0 }} />
        {/* Theme */}
        {event.theme && (
          <View style={rowStyle}>
            <FontAwesome6 name={event.theme.icon} size={20} color={iconColor} style={{ marginRight: 12 }} />
            <Text style={{ color: iconColor, fontSize: 16 }}>
              {event.theme.name.split("")[0].toUpperCase() + event.theme.name.slice(1)}
            </Text>
          </View>
        )}
        <View style={{ width: 1, height: 40, backgroundColor: theme.colors.shadow, marginHorizontal: 0 }} />
        {/* Country */}
        {event.location && (
          <View style={{ ...rowStyle, flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Flag name={event.location.country} />
            <Text style={{ color: iconColor, fontSize: 16 }}>{event.location.country}</Text>
          </View>
        )}
      </View>

      <View
        style={{
          width: "100%",
        }}
      >
        <Divider style={{ marginVertical: 4, backgroundColor: theme.colors.shadow, height: 1 }} />
        {/* Creator */}
        {event.creator && (
          <View style={rowStyle}>
            {event.creator.avatarUrl ? (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  overflow: "hidden",
                  marginRight: 12,
                }}
              >
                <Image
                  source={{ uri: event.creator.avatarUrl }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <FontAwesome6 name="user" size={20} color={iconColor} style={{ marginRight: 12 }} />
            )}
            <Text style={{ color: iconColor, fontSize: 16 }}>By: {event.creator.name}</Text>
          </View>
        )}
        <Divider style={{ marginVertical: 4, backgroundColor: theme.colors.shadow, height: 1 }} />
        {/* Location */}
        {event.location && (
          <>
            <View style={rowStyle}>
              <FontAwesome6 name="location-dot" size={20} color={iconColor} style={{ marginRight: 12 }} />
              <Text style={{ color: iconColor, fontSize: 16 }}>
                {event.location.city}, {event.location.address}
              </Text>
            </View>
            <Divider style={{ marginVertical: 4, backgroundColor: theme.colors.shadow, height: 1 }} />
          </>
        )}
        {/* Start Time */}
        <>
          <View style={rowStyle}>
            <FontAwesome6 name="calendar" size={20} color={iconColor} style={{ marginRight: 12 }} />
            <Text style={{ color: iconColor, fontSize: 16 }}>{dayjs(event.startAt).format("DD MMMM YYYY")}</Text>
          </View>
          <Divider style={{ marginVertical: 4, backgroundColor: theme.colors.shadow, height: 1 }} />
        </>
        {/* Start hour */}
        <>
          <View style={rowStyle}>
            <FontAwesome6 name="clock" size={20} color={iconColor} style={{ marginRight: 12 }} />
            <Text style={{ color: iconColor, fontSize: 16 }}>{dayjs(event.startAt).format("HH:mm")}</Text>
          </View>
          <Divider style={{ marginVertical: 4, backgroundColor: "transparent", height: 1 }} />
        </>
      </View>
    </View>
  )
}
