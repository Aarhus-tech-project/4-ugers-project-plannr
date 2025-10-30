import AttendanceModeSelector from "@/components/AttendanceModeSelector"
import CustomDateRangeCalendar from "@/components/CustomDateRangeCalendar"
import { DateRangeModeSelector } from "@/components/DateRangeModeSelector"
import DiscoveryRangeSlider from "@/components/DiscoveryRangeSlider"
import EventThemeSelector from "@/components/EventThemeSelector"
import LocationOptionSelector from "@/components/LocationOptionSelector"
import MapPicker from "@/components/MapPicker"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useLazyEventThemes } from "@/hooks/useLazyEventThemes"
import { useLiveLocation } from "@/hooks/useLiveLocation"
import { usePreferences } from "@/hooks/usePreferences"
import type { EventLocation } from "@/interfaces/event"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { ActivityIndicator, Button, Text } from "react-native-paper"
export default function Preferences() {
  const theme = useCustomTheme()
  const router = useRouter()
  const {
    range,
    setRange,
    selectedThemes,
    setSelectedThemes,
    dateRangeMode,
    setDateRangeMode,
    eventType,
    setEventType,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    updateModeFromCustom,
    resetPreferences,
    isChanged,
  } = usePreferences()

  const [useCurrentLocation, setUseCurrentLocation] = React.useState(true)

  const [selectedLocation, setSelectedLocation] = React.useState<Pick<EventLocation, "latitude" | "longitude"> | null>(
    null
  )
  const { visibleThemes } = useLazyEventThemes(10, 600)
  const { location: liveLocation } = useLiveLocation()
  const locationLoading = !liveLocation

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.secondary }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          paddingTop: 80,
          paddingBottom: 16,
          paddingLeft: 20,
          backgroundColor: theme.colors.secondary,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 4, borderRadius: 16, position: "absolute", left: 20, top: 82 }}
          activeOpacity={0.6}
        >
          <FontAwesome6 name="chevron-left" size={24} color={theme.colors.onBackground} />
        </TouchableOpacity>
        <Text
          style={{
            color: theme.colors.onBackground,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 32,
            left: 40,
          }}
        >
          Finder Preferences
        </Text>
      </View>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 100, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Location Option Card */}
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: theme.colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 8,
          }}
        >
          <LocationOptionSelector useCurrentLocation={useCurrentLocation} onChange={setUseCurrentLocation} />
          <View style={{ position: "relative" }}>
            <MapPicker
              location={
                useCurrentLocation
                  ? liveLocation
                    ? {
                        latitude: liveLocation.coords.latitude,
                        longitude: liveLocation.coords.longitude,
                      }
                    : null
                  : selectedLocation ??
                    (liveLocation
                      ? {
                          latitude: liveLocation.coords.latitude,
                          longitude: liveLocation.coords.longitude,
                        }
                      : null)
              }
              range={range * 1000}
              {...(!useCurrentLocation && { onLocationChange: setSelectedLocation })}
              {...(useCurrentLocation && { disableSelection: true })}
            />
            {locationLoading && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  borderRadius: 16,
                }}
              >
                <ActivityIndicator size="large" color={theme.colors.brand.red} />
              </View>
            )}
          </View>
        </View>
        {/* Discovery Range Card */}
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: theme.colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 8,
          }}
        >
          <DiscoveryRangeSlider value={range} onValueChange={setRange} />
        </View>
        {/* Event Themes Card */}
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: theme.colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 8,
          }}
        >
          <EventThemeSelector themes={visibleThemes} selectedThemes={selectedThemes} onSelect={setSelectedThemes} />
        </View>

        {/* Date Range Card */}
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: theme.colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 8,
          }}
        >
          <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18, marginBottom: 8 }}>
            Date Range
          </Text>
          <DateRangeModeSelector
            mode={dateRangeMode}
            setMode={setDateRangeMode}
            customStart={customStart}
            setCustomStart={setCustomStart}
            customEnd={customEnd}
            setCustomEnd={setCustomEnd}
          />
          {dateRangeMode.custom && (
            <CustomDateRangeCalendar
              customStart={customStart}
              customEnd={customEnd}
              onStartChange={(date) => {
                setCustomStart(date)
                updateModeFromCustom(date, customEnd)
              }}
              onEndChange={(date) => {
                setCustomEnd(date)
                updateModeFromCustom(customStart, date)
              }}
            />
          )}
        </View>
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: theme.colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 8,
          }}
        >
          <AttendanceModeSelector formats={[eventType]} onChange={(arr) => setEventType(arr[0] || "inperson")} />
        </View>
      </ScrollView>
      {/* Bottom Navbar for Reset & Save Buttons */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          backgroundColor: theme.colors.gray[900],
          borderTopWidth: 0,
          padding: 21.5,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          mode="outlined"
          onPress={resetPreferences}
          style={{
            flex: 1,
            marginRight: 8,
            borderWidth: 0,
            backgroundColor: theme.colors.gray[700],
            borderRadius: 16,
            shadowColor: theme.colors.brand.red,
            shadowOpacity: 0.08,
            shadowRadius: 4,
          }}
        >
          <Text style={{ color: theme.colors.white, fontWeight: "bold" }}>Reset</Text>
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            /* Save logic here */
          }}
          style={{
            flex: 1,
            marginLeft: 8,
            borderRadius: 16,
            borderWidth: 0,
            backgroundColor: theme.colors.brand.red,
            shadowColor: theme.colors.brand.red,
            shadowOpacity: 0.08,
            shadowRadius: 4,
          }}
          disabled={!isChanged}
        >
          <Text style={{ color: theme.colors.white, fontWeight: "bold" }}>Save</Text>
        </Button>
      </View>
    </View>
  )
}
