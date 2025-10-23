import { FontAwesome6 } from "@expo/vector-icons"
import dayjs from "dayjs"
import { View } from "react-native"
import { Divider, Text, useTheme } from "react-native-paper"
import type { Event } from "../../types/event"

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
          paddingVertical: 16,
          gap: 16,
        }}
      >
        {/* Interested Count */}
        <View style={rowStyle}>
          <FontAwesome6 name="users" size={20} color={iconColor} style={{ marginRight: 12 }} />
          <Text style={{ color: iconColor, fontSize: 16 }}>{event.interestedCount}</Text>
        </View>
        <View style={{ width: 0.1, height: 40, backgroundColor: theme.colors.shadow, marginHorizontal: 0 }} />
        {/* Theme */}
        {event.theme && (
          <View style={rowStyle}>
            <FontAwesome6 name="palette" size={20} color={iconColor} style={{ marginRight: 12 }} />
            <Text style={{ color: iconColor, fontSize: 16 }}>
              {event.theme.split("")[0].toUpperCase() + event.theme.slice(1)}
            </Text>
          </View>
        )}
      </View>

      <View
        style={{
          width: "100%",
        }}
      >
        <Divider style={{ marginBottom: 4, backgroundColor: theme.colors.shadow }} />
        {/* Location */}
        {event.location && (
          <>
            <View style={rowStyle}>
              <FontAwesome6 name="location-dot" size={20} color={iconColor} style={{ marginRight: 12 }} />
              <Text style={{ color: iconColor, fontSize: 16 }}>
                {event.location.city}, {event.location.country}
              </Text>
            </View>
            <Divider style={{ marginVertical: 4, backgroundColor: theme.colors.shadow }} />
          </>
        )}
        {/* Start Time */}
        <>
          <View style={rowStyle}>
            <FontAwesome6 name="calendar" size={20} color={iconColor} style={{ marginRight: 12 }} />
            <Text style={{ color: iconColor, fontSize: 16 }}>{dayjs(event.startTime).format("DD MMMM YYYY")}</Text>
          </View>
          <Divider style={{ marginVertical: 4, backgroundColor: theme.colors.shadow }} />
        </>
        {/* Start hour */}
        <>
          <View style={rowStyle}>
            <FontAwesome6 name="clock" size={20} color={iconColor} style={{ marginRight: 12 }} />
            <Text style={{ color: iconColor, fontSize: 16 }}>{dayjs(event.startTime).format("HH:mm")}</Text>
          </View>
          <Divider style={{ marginVertical: 4, height: 0 }} />
        </>
      </View>
    </View>
  )
}
