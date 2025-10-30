import AttendanceModeSelector from "@/components/AttendanceModeSelector"
import CustomDateRangeCalendar from "@/components/CustomDateRangeCalendar"
import DiscoveryRangeSlider from "@/components/DiscoveryRangeSlider"
import EventThemeSelector from "@/components/EventThemeSelector"
import LocationOptionSelector from "@/components/LocationOptionSelector"
import MapPicker from "@/components/MapPicker"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { useFilters } from "@/hooks/useFilters"
import { useLazyEventThemes } from "@/hooks/useLazyEventThemes"
import { useLiveLocation } from "@/hooks/useLiveLocation"
import React from "react"
import { Modal, ScrollView, StyleSheet, View } from "react-native"
import { Button, Text } from "react-native-paper"
import { DateRangeModeSelector } from "./DateRangeModeSelector"

import type { FiltersState } from "@/hooks/useFilters"

interface FilterModalProps {
  visible: boolean
  onClose: () => void
  onApply: (filters: ReturnType<typeof useFilters>) => void
  initial?: Partial<FiltersState>
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply, initial }) => {
  const theme = useCustomTheme()
  const { visibleThemes } = useLazyEventThemes(1, 0)
  const { location: liveLocation } = useLiveLocation()
  const filters = useFilters(initial)

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
              <LocationOptionSelector
                useCurrentLocation={filters.useCurrentLocation}
                onChange={filters.setUseCurrentLocation}
              />
              <MapPicker
                location={
                  filters.useCurrentLocation
                    ? liveLocation
                      ? {
                          latitude: liveLocation.coords.latitude,
                          longitude: liveLocation.coords.longitude,
                        }
                      : null
                    : filters.selectedLocation ??
                      (liveLocation
                        ? {
                            latitude: liveLocation.coords.latitude,
                            longitude: liveLocation.coords.longitude,
                          }
                        : null)
                }
                range={(filters.range ?? 50) * 1000}
                onLocationChange={filters.setSelectedLocation}
                disableSelection={false}
              />
              <View
                style={{
                  marginVertical: 16,
                }}
              >
                <DiscoveryRangeSlider value={filters.range ?? 50} onValueChange={filters.setRange} />
              </View>
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
                selectedThemes={visibleThemes.filter((theme) => filters.selectedThemes.includes(theme.name))}
                onSelect={(themes) => filters.setSelectedThemes(themes.map((theme) => theme.name))}
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
                mode={filters.mode}
                setMode={filters.setMode}
                customStart={filters.customStart}
                setCustomStart={filters.setCustomStart}
                customEnd={filters.customEnd}
                setCustomEnd={filters.setCustomEnd}
              />
              {filters.mode.custom && (
                <CustomDateRangeCalendar
                  customStart={filters.customStart}
                  customEnd={filters.customEnd}
                  onStartChange={filters.setCustomStart}
                  onEndChange={filters.setCustomEnd}
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
              <AttendanceModeSelector formats={filters.formats} onChange={filters.setFormats} />
            </View>
          </ScrollView>
          {/* Bottom Navbar for Cancel & Apply Buttons */}
          <View style={[styles.bottomBar, { backgroundColor: theme.colors.gray[900] }]}>
            <Button
              mode="outlined"
              onPress={onClose}
              style={[styles.button, { backgroundColor: theme.colors.gray[700] }]}
            >
              <Text style={{ color: theme.colors.white, fontWeight: "bold" }}>Cancel</Text>
            </Button>
            <Button
              mode="contained"
              onPress={() =>
                onApply({
                  ...filters,
                  dateRangeMode: filters.mode,
                })
              }
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
