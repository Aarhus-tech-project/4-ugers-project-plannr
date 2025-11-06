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
  const hourScrollRef = React.useRef<ScrollView>(null)
  const minuteScrollRef = React.useRef<ScrollView>(null)

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
      setHour(value.getHours())
      setMinute(value.getMinutes())
      setTimeout(() => {
        const hourIndex = HOUR_LIST.findIndex((h, i) => h === value.getHours() && i >= HOUR_LIST.length / 2)
        const minuteIndex = MINUTE_LIST.findIndex((m, i) => m === value.getMinutes() && i >= MINUTE_LIST.length / 2)
        if (hourIndex !== -1) hourScrollRef.current?.scrollTo({ y: hourIndex * ITEM_HEIGHT, animated: false })
        if (minuteIndex !== -1) minuteScrollRef.current?.scrollTo({ y: minuteIndex * ITEM_HEIGHT, animated: false })
      }, 10)
    }
  }, [visible])

  const handleSet = () => {
    if (value) {
      if (!isValidTime(hour, minute)) return // Prevent invalid set
      const newDate = new Date(value)
      newDate.setHours(hour)
      newDate.setMinutes(minute)
      newDate.setSeconds(0)
      newDate.setMilliseconds(0)
      onChange(newDate)
    }
    setVisible(false)
  }

  return (
    <View style={styles.container}>
      <Chip
        onPress={() => setVisible(true)}
        disabled={disabled}
        style={{
          backgroundColor: theme.colors.background,
          marginVertical: 4,
          minWidth: 80,
          borderWidth: 0,
          justifyContent: "center",
          width: "100%",
          borderRadius: 10,
        }}
        icon={() => null}
        selected={visible}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <Text style={{ color: theme.colors.onBackground, fontWeight: "bold", fontSize: 16 }}>
            {!value
              ? "--:--"
              : `${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`}
          </Text>
          <FontAwesome6 name="chevron-down" size={14} color={theme.colors.brand.red} />
        </View>
      </Chip>
      <Modal
        visible={visible}
        transparent
        navigationBarTranslucent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.pickerCard, { backgroundColor: theme.colors.background }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                minHeight: ITEM_HEIGHT * 5,
              }}
            >
              {/* Flexbox-centered highlight bar */}
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  height: 40,
                  backgroundColor: theme.colors.brand.red + "20",
                  borderRadius: 12,
                  marginBottom: -30,
                }}
              />
              {/* Hour wheel */}
              <View style={styles.wheelColumn}>
                <Text style={[styles.wheelLabel, { color: theme.colors.onBackground }]}>Hour</Text>
                <ScrollView
                  style={styles.wheelList}
                  showsVerticalScrollIndicator={false}
                  ref={hourScrollRef}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
                  onScroll={(e) => {
                    const y = e.nativeEvent.contentOffset.y
                    const idx = Math.round(y / ITEM_HEIGHT)
                    // Allow vibration and sound at edges
                    const h = HOUR_LIST[idx % HOUR_LIST.length]
                    if (h !== prevHourRef.current) {
                      vibrateWheelChange()
                      prevHourRef.current = h
                    }
                  }}
                  scrollEventThrottle={16}
                  onMomentumScrollEnd={(e) => {
                    const y = e.nativeEvent.contentOffset.y
                    const idx = Math.round(y / ITEM_HEIGHT)
                    const h = HOUR_LIST[idx % HOUR_LIST.length]
                    setHour(h)
                    prevHourRef.current = h
                  }}
                >
                  {HOUR_LIST.map((h, i) => {
                    // Only show minutes that are valid for this hour
                    const validMinuteExists = MINUTE_LIST.some((m) => isValidTime(h, m))
                    return (
                      <TouchableOpacity
                        key={i}
                        style={styles.wheelItem}
                        onPress={() => {
                          if (!validMinuteExists) return
                          if (h !== prevHourRef.current) {
                            setHour(h)
                            vibrateWheelChange()

                            prevHourRef.current = h
                          } else {
                            setHour(h)
                          }
                          hourScrollRef.current?.scrollTo({ y: i * ITEM_HEIGHT, animated: true })
                        }}
                        disabled={!validMinuteExists}
                      >
                        <Text
                          style={{
                            color:
                              h === hour
                                ? theme.colors.brand.red
                                : validMinuteExists
                                ? theme.colors.gray[700]
                                : theme.colors.gray[400],
                            fontWeight: h === hour ? "bold" : "normal",
                            fontSize: 20,
                            textAlign: "center",
                            opacity: validMinuteExists ? 1 : 0.3,
                          }}
                        >
                          {h.toString().padStart(2, "0")}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
              </View>
              {/* Minute wheel */}
              <View style={styles.wheelColumn}>
                <Text style={[styles.wheelLabel, { color: theme.colors.onBackground }]}>Minute</Text>
                <ScrollView
                  style={styles.wheelList}
                  showsVerticalScrollIndicator={false}
                  ref={minuteScrollRef}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
                  onScroll={(e) => {
                    const y = e.nativeEvent.contentOffset.y
                    const idx = Math.round(y / ITEM_HEIGHT)
                    // Allow vibration and sound at edges
                    const m = MINUTE_LIST[idx % MINUTE_LIST.length]
                    if (m !== prevMinuteRef.current) {
                      vibrateWheelChange()
                      prevMinuteRef.current = m
                    }
                  }}
                  scrollEventThrottle={16}
                  onMomentumScrollEnd={(e) => {
                    const y = e.nativeEvent.contentOffset.y
                    const idx = Math.round(y / ITEM_HEIGHT)
                    const m = MINUTE_LIST[idx % MINUTE_LIST.length]
                    setMinute(m)
                    prevMinuteRef.current = m
                  }}
                >
                  {MINUTE_LIST.map((m, i) => {
                    const valid = isValidTime(hour, m)
                    return (
                      <TouchableOpacity
                        key={i}
                        style={styles.wheelItem}
                        onPress={() => {
                          if (!valid) return
                          if (m !== prevMinuteRef.current) {
                            setMinute(m)
                            vibrateWheelChange()
                            prevMinuteRef.current = m
                          } else {
                            setMinute(m)
                          }
                          minuteScrollRef.current?.scrollTo({ y: i * ITEM_HEIGHT, animated: true })
                        }}
                        disabled={!valid}
                      >
                        <Text
                          style={{
                            color:
                              m === minute
                                ? theme.colors.brand.red
                                : valid
                                ? theme.colors.gray[700]
                                : theme.colors.gray[400],
                            fontWeight: m === minute ? "bold" : "normal",
                            fontSize: 20,
                            textAlign: "center",
                            opacity: valid ? 1 : 0.3,
                          }}
                        >
                          {m.toString().padStart(2, "0")}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                marginTop: 5,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                mode="outlined"
                onPress={() => setVisible(false)}
                textColor={theme.colors.white}
                style={{
                  backgroundColor: theme.colors.gray[800],
                  flex: 1,
                  minWidth: 90,
                  marginHorizontal: 8,
                  borderRadius: 16,
                  borderWidth: 0,
                }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSet}
                textColor={theme.colors.brand.white}
                style={{
                  backgroundColor: theme.colors.brand.red,
                  flex: 1,
                  minWidth: 90,
                  marginHorizontal: 8,
                  borderRadius: 16,
                  borderWidth: 0,
                }}
                disabled={!isValidTime(hour, minute)}
              >
                Set
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerCard: {
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    minWidth: 260,
    maxWidth: 320,
    alignItems: "center",
  },
  wheelColumn: {
    marginHorizontal: 12,
    alignItems: "center",
    width: 70,
  },
  wheelLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  wheelList: {
    height: ITEM_HEIGHT * 5,
    minWidth: 60,
    borderRadius: 12,
    backgroundColor: "#fff0",
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginVertical: 0,
    width: "100%",
  },
})
