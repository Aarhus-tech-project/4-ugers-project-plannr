import Flag from "@/components/ui/Flag"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import type { Event } from "@/interfaces/event"
import { eventThemes } from "@/utils/event-content"
import { FontAwesome6 } from "@expo/vector-icons"
import dayjs from "dayjs"
import { Linking, Platform, ScrollView, TouchableOpacity, View } from "react-native"
import { Divider, Text } from "react-native-paper"

import type { Profile } from "@/interfaces/profile"

interface EventDetailsButton {
  label: string
  onPress: () => void
  backgroundColor?: string
  textColor?: string
  icon?: string
  disabled?: boolean
  mode?: "contained" | "outlined"
}

interface Props {
  event: Event
  profile?: Profile
  displayTitle?: boolean
  going?: boolean
  buttons?: EventDetailsButton[]
}

import React from "react"

export default function EventDetailsCard({ event, buttons, displayTitle, going }: Props) {
  const theme = useCustomTheme()

  const iconColor = theme.colors.brand.red
  const textColor = theme.colors.onBackground
  const rowStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 8,
  }
  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: buttons && buttons.length > 0 ? 0 : 16,
          borderBottomRightRadius: buttons && buttons.length > 0 ? 0 : 16,
          backgroundColor: theme.colors.secondary,
          paddingHorizontal: 24,
          paddingVertical: 8,
          position: "relative",
        }}
      >
        {displayTitle && (
          <>
            <Text style={{ color: textColor, fontSize: 20, fontWeight: "bold", marginVertical: 8 }}>{event.title}</Text>
            <Divider style={{ width: "100%", marginBottom: 8 }} />
          </>
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            borderRadius: 16,
            gap: 16,
          }}
        >
          {/* Going Count */}
          <View style={rowStyle}>
            <FontAwesome6 name="users" size={20} color={iconColor} style={{ marginRight: 12 }} />
            <Text style={{ color: textColor, fontSize: 16 }}>{event.attendance?.going ?? 0}</Text>
          </View>
          <View style={{ width: 1, height: 40, backgroundColor: theme.colors.shadow, marginHorizontal: 0 }} />
          {/* Themes (stacked icons and summary) */}
          {event.themes && event.themes.length > 0 && (
            <View style={{ ...rowStyle, gap: 0 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginRight: 8 }}>
                {event.themes.slice(0, 3).map((themeName, idx) => {
                  const themeObj = eventThemes.find((t) => t.name === themeName)
                  if (!themeObj) return null
                  return (
                    <View
                      key={themeName}
                      style={{
                        zIndex: 10 - idx,
                        marginLeft: idx === 0 ? 0 : -12,
                        backgroundColor: theme.colors.brand.red,
                        borderRadius: 16,
                        width: 32,
                        height: 32,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: theme.colors.secondary,
                      }}
                    >
                      <FontAwesome6 name={themeObj.icon} size={16} color={theme.colors.background} />
                    </View>
                  )
                })}
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 4, position: "relative" }}>
                <Text style={{ color: textColor, fontSize: 16 }}>
                  {event.themes[0].charAt(0).toUpperCase() + event.themes[0].slice(1)}
                </Text>
                {event.themes.length > 1 && (
                  <Text
                    style={{
                      fontSize: 16,
                      marginLeft: 2,
                    }}
                  >
                    {`, +${event.themes.length - 1} more`}
                  </Text>
                )}
              </View>
            </View>
          )}
          <View style={{ width: 1, height: 40, backgroundColor: theme.colors.shadow, marginHorizontal: 0 }} />
          {/* Country */}
          {event.location?.country && (
            <View style={{ ...rowStyle, flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View
                style={{
                  backgroundColor: theme.colors.brand.red,
                  borderRadius: 6,
                  width: 26,
                  height: 26,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 0,
                  overflow: "hidden",
                }}
              >
                <Flag cca2={event.location.country} size={26} />
              </View>
              <Text style={{ color: textColor, fontSize: 16 }}>{event.location.country}</Text>
            </View>
          )}
        </ScrollView>

        <View
          style={{
            width: "100%",
          }}
        >
          {/* Location */}
          {event.location?.city && event.location?.address && (
            <>
              <View style={{ ...rowStyle, flexDirection: "row", alignItems: "center", gap: 6 }}>
                <FontAwesome6 name="location-dot" size={20} color={iconColor} style={{ marginRight: 12 }} />
                <Text
                  style={{ color: textColor, fontSize: 16, textDecorationLine: "underline" }}
                  selectable
                  selectionColor={theme.colors.brand.red}
                  onPress={() => {
                    if (!event.location?.address && !event.location?.city) return
                    const query = encodeURIComponent(`${event.location.address}, ${event.location.city}`)
                    const url = Platform.select({
                      ios: `http://maps.apple.com/?q=${query}`,
                      android: `geo:0,0?q=${query}`,
                      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
                    })
                    Linking.openURL(url as string)
                  }}
                >
                  {event.location.city}, {event.location.address}
                </Text>
              </View>
            </>
          )}
          {/* Venue */}
          {event?.location?.venue && (
            <>
              <View style={{ ...rowStyle, flexDirection: "row", alignItems: "center", gap: 6 }}>
                <FontAwesome6 name="building" size={20} color={iconColor} style={{ marginRight: 12 }} />
                <Text style={{ color: textColor, fontSize: 16 }} selectable selectionColor={theme.colors.brand.red}>
                  {event.location.venue}
                </Text>
              </View>
            </>
          )}
          {/* Age Restriction */}
          {event?.ageRestriction && (
            <>
              <View style={rowStyle}>
                <FontAwesome6 name="user-shield" size={20} color={iconColor} style={{ marginRight: 12 }} />
                <Text style={{ color: textColor, fontSize: 16 }}>Age limit {event.ageRestriction}+</Text>
              </View>
            </>
          )}
          {/* Access Info */}
          {event?.access && going && (
            <>
              <View style={rowStyle}>
                <FontAwesome6 name="lock" size={20} color={iconColor} style={{ marginRight: 12 }} />
                <Text style={{ color: textColor, fontSize: 16 }}>
                  Instructions: {event?.access?.instruction}
                  {event?.access?.password ? `  Password: ${event.access.password}` : ""}
                </Text>
              </View>
            </>
          )}
          {/* Start Time */}
          {event?.dateRange?.startAt && (
            <>
              <View style={rowStyle}>
                <FontAwesome6 name="calendar" size={20} color={iconColor} style={{ marginRight: 12 }} />
                <Text style={{ color: textColor, fontSize: 16 }}>
                  {dayjs.utc(event.dateRange.startAt).local().format("DD MMMM YYYY")}
                </Text>
              </View>
            </>
          )}
          {/* Start hour */}
          {event?.dateRange?.startAt && (
            <>
              <View style={rowStyle}>
                <FontAwesome6 name="clock" size={20} color={iconColor} style={{ marginRight: 12 }} />
                <Text style={{ color: textColor, fontSize: 16 }}>
                  {dayjs.utc(event.dateRange.startAt).local().format("HH:mm")}
                </Text>
                {event.dateRange?.endAt && <Text style={{ color: textColor, fontSize: 16 }}> - </Text>}
                {event.dateRange?.endAt && (
                  <Text style={{ color: textColor, fontSize: 16 }}>
                    {dayjs.utc(event.dateRange.endAt).local().format("HH:mm")}
                  </Text>
                )}
              </View>
            </>
          )}
        </View>
      </View>

      {buttons && buttons.length > 0 && (
        <View style={{ flexDirection: "row", width: "100%", height: 42, margin: 0, padding: 0 }}>
          {buttons.map((btn, idx) => (
            <React.Fragment key={btn.label + idx}>
              <TouchableOpacity
                disabled={btn.disabled}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: btn.backgroundColor || theme.colors.brand.red,
                  borderBottomLeftRadius: idx === 0 ? 16 : 0,
                  borderBottomRightRadius: idx === buttons.length - 1 ? 16 : 0,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  margin: 0,
                  padding: 0,
                }}
                onPress={btn.onPress}
              >
                {btn.icon && (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      justifyContent: "center",
                      marginRight: 8,
                    }}
                  >
                    <FontAwesome6 name={btn.icon} size={16} color={btn.textColor || theme.colors.brand.red} />
                  </View>
                )}
                <Text style={{ color: btn.textColor || theme.colors.white, fontWeight: "bold", fontSize: 16 }}>
                  {btn.label}
                </Text>
              </TouchableOpacity>
              {idx < buttons.length - 1 && (
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
              )}
            </React.Fragment>
          ))}
        </View>
      )}
    </>
  )
}
