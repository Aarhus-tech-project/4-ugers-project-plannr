import { WheelTimePicker } from "@/components/WheelTimePicker"
import { useCustomTheme } from "@/hooks/useCustomTheme"
import DateTimePicker from "@react-native-community/datetimepicker"
import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

interface ScheduleItem {
  time: Date
  activity: string
}

interface ScheduleSectionProps {
  items: ScheduleItem[]
  onChange: (items: ScheduleItem[]) => void
  error?: string
  minDate?: Date
  maxDate?: Date
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ items, onChange, error, minDate, maxDate }) => {
  const theme = useCustomTheme()
  const [pickerIdx, setPickerIdx] = React.useState<number | null>(null)
  const [showDatePicker, setShowDatePicker] = React.useState(false)
  const addItem = () => {
    // Use minDate as default if available, else current date
    let initialDate = minDate ? new Date(minDate) : new Date()
    // Clamp initialDate to min/max
    if (minDate && initialDate < minDate) initialDate = new Date(minDate)
    if (maxDate && initialDate > maxDate) initialDate = new Date(maxDate)
    onChange([...items, { time: initialDate, activity: "" }])
  }
  const updateItem = (idx: number, key: keyof ScheduleItem, value: any) => {
    const updated = items.map((item, i) => (i === idx ? { ...item, [key]: value } : item))
    onChange(updated)
  }
  const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx))

  return (
    <View
      style={{
        marginVertical: 12,
        backgroundColor: theme.colors.background,
        borderRadius: 16,
        padding: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ color: theme.colors.gray[500], fontSize: 14 }}>Add a timeline or schedule for your event.</Text>
      </View>
      {items.map((item, idx) => (
        <View
          key={idx}
          style={{
            marginBottom: 12,
            backgroundColor: theme.colors.background,
            borderRadius: 10,
          }}
        >
          <TextInput
            value={item.activity}
            onChangeText={(v) => updateItem(idx, "activity", v)}
            placeholder="Activity"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 0,
              borderRadius: 10,
              padding: 14,
              marginBottom: 8,
              backgroundColor: theme.colors.secondary,
              color: theme.colors.onBackground,
              fontSize: 16,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setPickerIdx(idx)
              setShowDatePicker(true)
            }}
            style={{
              borderWidth: 0,
              borderRadius: 10,
              padding: 14,
              marginBottom: 8,
              backgroundColor: theme.colors.secondary,
            }}
          >
            <Text style={{ color: theme.colors.onBackground, fontSize: 15 }}>
              {item.time.toLocaleDateString()}{" "}
              {item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </TouchableOpacity>
          {pickerIdx === idx && showDatePicker && (
            <>
              <DateTimePicker
                value={item.time}
                mode="date"
                display="default"
                minimumDate={minDate}
                maximumDate={maxDate}
                onChange={(event, date) => {
                  if (date) {
                    // Clamp date to min/max
                    let clampedDate = date
                    if (minDate && clampedDate < minDate) clampedDate = minDate
                    if (maxDate && clampedDate > maxDate) clampedDate = maxDate
                    updateItem(
                      idx,
                      "time",
                      new Date(clampedDate.setHours(item.time.getHours(), item.time.getMinutes()))
                    )
                  }
                  setShowDatePicker(false)
                }}
              />
              <WheelTimePicker
                value={item.time}
                onChange={(date: Date) => {
                  // Clamp time to min/max date
                  let clampedDate = date
                  if (minDate && clampedDate < minDate) clampedDate = minDate
                  if (maxDate && clampedDate > maxDate) clampedDate = maxDate
                  updateItem(idx, "time", clampedDate)
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setPickerIdx(null)
                  setShowDatePicker(false)
                }}
              >
                <Text style={{ color: theme.colors.brand.red, marginTop: 4, fontWeight: "bold" }}>Done</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity onPress={() => removeItem(idx)}>
            <Text style={{ color: theme.colors.brand.red, marginTop: 4, fontWeight: "bold" }}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addItem} style={{ marginTop: 6 }}>
        <Text style={{ color: theme.colors.brand.blue, fontWeight: "bold" }}>+ Add Schedule Item</Text>
      </TouchableOpacity>
      {typeof error === "string" && error.length > 0 && (
        <Text style={{ color: theme.colors.brand.red, marginTop: 4, fontSize: 13 }}>{error}</Text>
      )}
    </View>
  )
}

export default ScheduleSection
