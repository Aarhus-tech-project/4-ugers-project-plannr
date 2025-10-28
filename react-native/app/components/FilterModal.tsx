import type { EventFormat } from "@/interfaces/event"

import AttendanceModeSelector from "@/components/AttendanceModeSelector"
import CustomDateRangeCalendar from "@/components/CustomDateRangeCalendar"
import DiscoveryRangeSlider from "@/components/DiscoveryRangeSlider"
import EventThemeSelector from "@/components/EventThemeSelector"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import React from "react"
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

export interface FilterModalFilters {
  eventType: EventFormat
  setEventType: (v: EventFormat) => void
  selectedThemes: string[]
  setSelectedThemes: (v: string[]) => void
  rangeKm: number
  setRangeKm: (v: number) => void
  dateRange: string
  setDateRange: (v: string) => void
  customStart: Date | null
  setCustomStart: (v: Date | null) => void
  customEnd: Date | null
  setCustomEnd: (v: Date | null) => void
}

export interface FilterModalProps {
  visible: boolean
  onClose: () => void
  filters: FilterModalFilters
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, filters }) => {
  const theme = useCustomTheme()
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.colors.secondary }]}>
          <Text style={{ color: theme.colors.onBackground, fontWeight: "bold", fontSize: 22, marginBottom: 16 }}>
            Filter Events
          </Text>
          <AttendanceModeSelector eventType={filters.eventType} onChange={filters.setEventType} />
          <View style={{ height: 16 }} />
          <EventThemeSelector
            themes={[]}
            selectedThemes={filters.selectedThemes}
            onSelect={filters.setSelectedThemes}
          />
          <View style={{ height: 16 }} />
          <DiscoveryRangeSlider value={filters.rangeKm} onValueChange={filters.setRangeKm} />
          <View style={{ height: 16 }} />
          <CustomDateRangeCalendar
            customStart={filters.customStart}
            customEnd={filters.customEnd}
            onStartChange={filters.setCustomStart}
            onEndChange={filters.setCustomEnd}
          />
          <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.colors.brand.red }]}>
            <Text style={{ color: theme.colors.white, fontWeight: "bold", fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
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
    width: "92%",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 8,
  },
  closeBtn: {
    marginTop: 24,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
  },
})

export default FilterModal
