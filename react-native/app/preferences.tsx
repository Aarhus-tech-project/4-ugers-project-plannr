import EventThemeSelector from "@/components/event/EventThemeSelector"
import KeyboardAwareScreen from "@/components/layout/KeyboardAwareScreen"
import AttendanceModeSelector from "@/components/ui/AttendanceModeSelector"
import CustomDateRangeCalendar from "@/components/ui/CustomDateRangeCalendar"
import { DateRangeModeSelector } from "@/components/ui/DateRangeModeSelector"
import DiscoveryRangeSlider from "@/components/ui/DiscoveryRangeSlider"
import LocationOptionSelector from "@/components/ui/LocationOptionSelector"
import MapPicker from "@/components/ui/MapPicker"
import { usePreferences } from "@/context/PreferencesContext"
import { usePreferencesVersion } from "@/context/PreferencesVersionContext"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useLazyEventThemes } from "@/hooks/useLazyEventThemes"
import { useLiveLocation } from "@/hooks/useLiveLocation"
import type { EventLocation } from "@/interfaces/event"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { ActivityIndicator, Text } from "react-native-paper"
export default function Preferences() {
  const theme = useCustomTheme()
  const router = useRouter()
  const { bump } = usePreferencesVersion()
  const {
    range,
    setRange,
    selectedThemes,
    setSelectedThemes,
    dateRangeMode,
    setDateRangeMode,
    eventTypes,
    setEventTypes,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    customLocation,
    setCustomLocation,
    updateModeFromCustom,
  } = usePreferences()

  // Initialize location state from preferences
  const [useCurrentLocation, setUseCurrentLocation] = React.useState(!customLocation)
  const [selectedLocation, setSelectedLocation] = React.useState<EventLocation | null>(
    customLocation
      ? {
          latitude: customLocation.latitude,
          longitude: customLocation.longitude,
          address: "",
          city: "",
          country: "",
          venue: "",
        }
      : null
  )

  // Sync local state with preferences when customLocation changes
  React.useEffect(() => {
    if (customLocation) {
      setSelectedLocation({
        latitude: customLocation.latitude,
        longitude: customLocation.longitude,
        address: "",
        city: "",
        country: "",
        venue: "",
      })
      setUseCurrentLocation(false)
    } else {
      setSelectedLocation(null)
      setUseCurrentLocation(true)
    }
  }, [customLocation])

  // Sync custom location to preferences
  const handleCustomLocationChange = (loc: EventLocation) => {
    setSelectedLocation(loc)
    setCustomLocation({ latitude: loc.latitude ?? 0, longitude: loc.longitude ?? 0 })
    setUseCurrentLocation(false)
  }
  const { visibleThemes } = useLazyEventThemes(10, 600)
  const { location: liveLocation, address: liveAddress } = useLiveLocation()
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
          onPress={() => {
            bump()
            router.back()
          }}
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
      <KeyboardAwareScreen
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 16, paddingTop: 16 }}
      >
        {/* Location Option Card */}
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <LocationOptionSelector useCurrentLocation={useCurrentLocation} onChange={setUseCurrentLocation} />
          <View style={{ position: "relative" }}>
            <MapPicker
              location={
                useCurrentLocation && liveLocation && liveAddress
                  ? {
                      address: liveAddress.street || "",
                      city: liveAddress.city || "",
                      country: liveAddress.country || "",
                      venue: liveAddress.name || "",
                      latitude: liveLocation.coords.latitude,
                      longitude: liveLocation.coords.longitude,
                    }
                  : !useCurrentLocation
                  ? selectedLocation
                  : null
              }
              range={range * 1000}
              {...(!useCurrentLocation && { onLocationChange: handleCustomLocationChange })}
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
          }}
        >
          <EventThemeSelector
            themes={visibleThemes}
            selectedThemes={selectedThemes}
            selectAllOption={true}
            onSelect={setSelectedThemes}
          />
        </View>

        {/* Date Range Card */}
        <View
          style={{
            width: "90%",
            backgroundColor: theme.colors.secondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
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
                if (dateRangeMode.custom) {
                  updateModeFromCustom(date, customEnd)
                }
              }}
              onEndChange={(date) => {
                setCustomEnd(date)
                if (dateRangeMode.custom) {
                  updateModeFromCustom(customStart, date)
                }
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
          }}
        >
          <AttendanceModeSelector formats={eventTypes ?? []} onChange={setEventTypes} />
        </View>
      </KeyboardAwareScreen>
    </View>
  )
}
