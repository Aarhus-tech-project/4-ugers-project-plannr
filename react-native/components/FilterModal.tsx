import AttendanceModeSelector from "@/components/AttendanceModeSelector"
import CustomDateRangeCalendar from "@/components/CustomDateRangeCalendar"
import DiscoveryRangeSlider from "@/components/DiscoveryRangeSlider"
import EventThemeSelector from "@/components/EventThemeSelector"
import LocationOptionSelector from "@/components/LocationOptionSelector"
import MapPicker from "@/components/MapPicker"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useLazyEventThemes } from "@/hooks/useLazyEventThemes"
import { useLiveLocation } from "@/hooks/useLiveLocation"
import React from "react"
import { Modal, ScrollView, StyleSheet, View } from "react-native"
import { Button, Text } from "react-native-paper"

import { EventFormat } from "@/interfaces/event"

interface FilterModalProps {
  visible: boolean
  onClose: () => void
  rangeKm: number
  setRangeKm: (value: number) => void
  selectedThemes: string[]
  setSelectedThemes: (themes: string[]) => void
  dateRange: string
  setDateRange: (range: string) => void
  eventType: EventFormat
  setEventType: (type: EventFormat) => void
  customStart: Date | null
  setCustomStart: (date: Date | null) => void
  customEnd: Date | null
  setCustomEnd: (date: Date | null) => void
  useCurrentLocation: boolean
  setUseCurrentLocation: (value: boolean) => void
  selectedLocation: { latitude: number; longitude: number } | null
  setSelectedLocation: (loc: { latitude: number; longitude: number } | null) => void
  onReset: () => void
  onApply: () => void
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  rangeKm,
  setRangeKm,
  selectedThemes,
  setSelectedThemes,
  dateRange,
  setDateRange,
  eventType,
  setEventType,
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
  useCurrentLocation,
  setUseCurrentLocation,
  selectedLocation,
  setSelectedLocation,
  onReset,
  onApply,
}) => {
  const theme = useCustomTheme()
  const { visibleThemes } = useLazyEventThemes(10, 600)
  const { location: liveLocation } = useLiveLocation()

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
      navigationBarTranslucent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.colors.background }]}>
          <ScrollView
            contentContainerStyle={{ alignItems: "center", paddingBottom: 100, paddingTop: 16 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
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
                range={rangeKm * 1000}
                {...(!useCurrentLocation && { onLocationChange: setSelectedLocation })}
                {...(useCurrentLocation && { disableSelection: true })}
              />
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
              <DiscoveryRangeSlider value={rangeKm} onValueChange={setRangeKm} />
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
              }}
            >
              <Text style={{ color: theme.colors.onBackground, fontWeight: "600", fontSize: 18, marginBottom: 8 }}>
                Date Range
              </Text>
              <View style={{ flexDirection: "row" }}>
                {["Today", "This Week", "Custom"].map((range) => {
                  const isSelected = dateRange === range
                  return (
                    <Button
                      key={range}
                      mode={isSelected ? "contained" : "outlined"}
                      onPress={() => setDateRange(range)}
                      style={{ margin: 4 }}
                    >
                      {range}
                    </Button>
                  )
                })}
              </View>
              {dateRange === "Custom" && (
                <CustomDateRangeCalendar
                  customStart={customStart}
                  customEnd={customEnd}
                  onStartChange={setCustomStart}
                  onEndChange={setCustomEnd}
                />
              )}
            </View>
            {/* Attendance Mode Card */}
            <View
              style={{
                width: "90%",
                backgroundColor: theme.colors.secondary,
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <AttendanceModeSelector eventType={eventType} onChange={setEventType} />
            </View>
          </ScrollView>
          {/* Bottom Navbar for Reset & Apply Buttons */}
          <View style={[styles.bottomBar, { backgroundColor: theme.colors.gray[900] }]}>
            <Button
              mode="outlined"
              onPress={onReset}
              style={[styles.button, { backgroundColor: theme.colors.gray[700] }]}
            >
              <Text style={{ color: theme.colors.white, fontWeight: "bold" }}>Reset</Text>
            </Button>
            <Button
              mode="contained"
              onPress={onApply}
              style={[styles.button, { backgroundColor: theme.colors.brand.red }]}
            >
              <Text style={{ color: theme.colors.white, fontWeight: "bold" }}>Apply</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "95%",
    maxHeight: "80%",
    borderRadius: 16,
    overflow: "hidden",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    borderWidth: 0,
    padding: 14,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 16,
    borderWidth: 0,
  },
})

export default FilterModal
