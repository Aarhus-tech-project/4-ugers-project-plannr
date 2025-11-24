import CustomDateRangeCalendar from "@/components/ui/CustomDateRangeCalendar"
import LocationOptionSelector from "@/components/ui/LocationOptionSelector"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import { FiltersState } from "@/hooks/useFilters"
import { useLazyEventThemes } from "@/hooks/useLazyEventThemes"
import { useLiveLocation } from "@/hooks/useLiveLocation"
import React from "react"
import { Modal, ScrollView, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import EventThemeSelector from "../event/EventThemeSelector"
import BottomButtonBar from "../navigation/BottomButtonBar"
import AttendanceModeSelector from "../ui/AttendanceModeSelector"
import { DateRangeModeSelector } from "../ui/DateRangeModeSelector"
import DiscoveryRangeSlider from "../ui/DiscoveryRangeSlider"
import MapPicker from "../ui/MapPicker"
interface FilterModalProps {
  visible: boolean
  onClose: () => void
  filters: FiltersState
  onApply: () => void
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, filters, onApply }) => {
  const theme = useCustomTheme()
  const { visibleThemes, loaded } = useLazyEventThemes(1, 600)
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
          <View
            style={{
              backgroundColor: theme.colors.secondary,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: theme.colors.onBackground,
                fontWeight: "700",
                fontSize: 20,
                marginTop: 16,
                marginBottom: 8,
                alignSelf: "center",
              }}
            >
              Filters
            </Text>
          </View>
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
                location={(() => {
                  const emptyLocation = {
                    address: "",
                    city: "",
                    country: "",
                    latitude: undefined,
                    longitude: undefined,
                  }
                  if (filters.useCurrentLocation) {
                    if (liveLocation && liveLocation.coords) {
                      return {
                        ...emptyLocation,
                        latitude: liveLocation.coords.latitude,
                        longitude: liveLocation.coords.longitude,
                      }
                    }
                    return null
                  }
                  if (filters.selectedLocation) {
                    return {
                      ...emptyLocation,
                      ...filters.selectedLocation,
                    }
                  }
                  if (liveLocation && liveLocation.coords) {
                    return {
                      ...emptyLocation,
                      latitude: liveLocation.coords.latitude,
                      longitude: liveLocation.coords.longitude,
                    }
                  }
                  return null
                })()}
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
                minHeight: 120,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!loaded ? (
                <Text style={{ color: theme.colors.gray[400], fontSize: 16, marginBottom: 8 }}>Loading themes...</Text>
              ) : null}
              <EventThemeSelector
                themes={visibleThemes}
                selectedThemes={visibleThemes.filter((theme) => filters.selectedThemes.includes(theme.name))}
                selectAllOption={true}
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
          <BottomButtonBar
            containerStyle={{ backgroundColor: theme.colors.gray[800] }}
            buttons={[
              {
                label: "Cancel",
                onPress: onClose,
                mode: "outlined",
                backgroundColor: theme.colors.gray[900],
                textColor: theme.colors.white,
              },
              {
                label: "Apply",
                onPress: onApply,
                mode: "contained",
                backgroundColor: theme.colors.brand.red,
                textColor: theme.colors.white,
              },
            ]}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
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
