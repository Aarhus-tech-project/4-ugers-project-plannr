import { useCustomTheme } from "@/hooks/useCustomTheme"
import { vibrateWheelChange } from "@/utils/vibrate"
import { FontAwesome6 } from "@expo/vector-icons"
import React, { useState } from "react"
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { Button, Chip, Text } from "react-native-paper"

const HOUR_LIST = Array.from({ length: 24 }, (_, i) => i)
const MINUTE_LIST = Array.from({ length: 60 }, (_, i) => i)

const ITEM_HEIGHT = 44

interface WheelTimePickerProps {
  value: Date | null
  onChange: (date: Date) => void
  disabled?: boolean
  min?: Date // New: minimum allowed time (inclusive)
}

export const WheelTimePicker: React.FC<WheelTimePickerProps> = ({ value, onChange, disabled, min }) => {
  const prevHourRef = React.useRef<number | undefined>(undefined)
  const prevMinuteRef = React.useRef<number | undefined>(undefined)
  const theme = useCustomTheme()
  const [visible, setVisible] = useState(false)
  const [hour, setHour] = useState<number>(value ? value.getHours() : 12)
  const [minute, setMinute] = useState<number>(value ? value.getMinutes() : 0)

  // Keep hour/minute in sync with value prop
  React.useEffect(() => {
    if (value) {
      setHour(value.getHours())
      setMinute(value.getMinutes())
      prevHourRef.current = value.getHours()
      prevMinuteRef.current = value.getMinutes()
    }
  }, [value])
  const hourScrollRef = React.useRef<ScrollView>(null) as React.RefObject<ScrollView>
  const minuteScrollRef = React.useRef<ScrollView>(null) as React.RefObject<ScrollView>

  // Helper: is this hour/minute valid?
  function isValidTime(h: number, m: number) {
    if (!min) return true
    if (!value) return true
    // Only block overlap for the same day
    const base = new Date(value)
    base.setHours(h)
    base.setMinutes(m)
    base.setSeconds(0)
    base.setMilliseconds(0)
    const isSameDay =
      min.getFullYear() === base.getFullYear() && min.getMonth() === base.getMonth() && min.getDate() === base.getDate()
    if (isSameDay) {
      return base.getTime() > min.getTime() // strictly after
    }
    return true
  }

  // Scroll to the middle selected value on open or value change
  React.useEffect(() => {
    if (visible && value && hourScrollRef.current && minuteScrollRef.current) {
      setTimeout(() => {
        hourScrollRef.current?.scrollTo({ y: hour * ITEM_HEIGHT, animated: false })
        minuteScrollRef.current?.scrollTo({ y: minute * ITEM_HEIGHT, animated: false })
      }, 0)
    }
  }, [visible, hour, minute, value])

  // Open modal
  function open() {
    setVisible(true)
  }
  // Close modal
  function close() {
    setVisible(false)
  }
  // Confirm selection
  function confirm() {
    const newDate = value ? new Date(value) : new Date()
    newDate.setHours(hour)
    newDate.setMinutes(minute)
    newDate.setSeconds(0)
    newDate.setMilliseconds(0)
    onChange(newDate)
    close()
  }

  // Select hour
  function selectHour(h: number) {
    setHour(h)
    vibrateWheelChange()
  }
  // Select minute
  function selectMinute(m: number) {
    setMinute(m)
    vibrateWheelChange()
  }

  // Render wheel item
  function renderWheelItem(
    list: number[],
    selected: number,
    select: (v: number) => void,
    scrollRef: React.RefObject<ScrollView>
  ) {
    return (
      <ScrollView
        ref={scrollRef}
        style={{ height: ITEM_HEIGHT * 5 }}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y
          const idx = Math.round(offsetY / ITEM_HEIGHT)
          if (list[idx] !== undefined) select(list[idx])
        }}
      >
        {list.map((v, _i) => (
          <TouchableOpacity
            key={v}
            style={{
              height: ITEM_HEIGHT,
              justifyContent: "center",
              alignItems: "center",
              opacity: v === selected ? 1 : 0.5,
            }}
            onPress={() => select(v)}
            disabled={disabled}
          >
            <Text style={{ fontSize: 20, fontWeight: v === selected ? "bold" : "normal" }}>
              {v.toString().padStart(2, "0")}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }

  return (
    <View>
      <Chip
        icon={() => <FontAwesome6 name="clock" size={16} color={theme.colors.brand.red} />}
        onPress={open}
        disabled={disabled}
        style={{ backgroundColor: theme.colors.gray[100], borderRadius: 8 }}
      >
        {value
          ? `${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`
          : "Vælg tid"}
      </Chip>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>Vælg tid</Text>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              {renderWheelItem(HOUR_LIST, hour, selectHour, hourScrollRef)}
              <Text style={{ fontSize: 20, marginHorizontal: 8 }}>:</Text>
              {renderWheelItem(MINUTE_LIST, minute, selectMinute, minuteScrollRef)}
            </View>
            <Button
              mode="contained"
              onPress={confirm}
              disabled={!isValidTime(hour, minute)}
              style={{ marginTop: 24, borderRadius: 8 }}
            >
              Bekræft
            </Button>
            <Button mode="text" onPress={close} style={{ marginTop: 8 }}>
              Annuller
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: 320,
    maxWidth: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
})
