import { useCustomTheme } from "@/hooks/useCustomTheme"
import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

interface ScheduleItem {
  time: Date
  activity: string
}

interface ScheduleSectionProps {
  items: ScheduleItem[]
  onChange: (items: ScheduleItem[]) => void
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ items, onChange }) => {
  const theme = useCustomTheme()
  const addItem = () => onChange([...items, { time: new Date(), activity: "" }])
  const updateItem = (idx: number, key: keyof ScheduleItem, value: any) => {
    const updated = items.map((item, i) => (i === idx ? { ...item, [key]: value } : item))
    onChange(updated)
  }
  const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx))

  return (
    <View style={{ marginVertical: 8 }}>
      {items.map((item, idx) => (
        <View
          key={idx}
          style={{
            marginBottom: 12,
            backgroundColor: theme.colors.gray[50],
            borderRadius: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: theme.colors.gray[100],
          }}
        >
          <TextInput
            value={item.activity}
            onChangeText={(v) => updateItem(idx, "activity", v)}
            placeholder="Activity"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.gray[200],
              borderRadius: 8,
              padding: 8,
              marginBottom: 6,
              color: theme.colors.onBackground,
              fontSize: 15,
              backgroundColor: theme.colors.white,
            }}
          />
          <TextInput
            value={item.time.toISOString()}
            onChangeText={(v) => updateItem(idx, "time", new Date(v))}
            placeholder="Time (ISO format)"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.gray[200],
              borderRadius: 8,
              padding: 8,
              color: theme.colors.onBackground,
              fontSize: 15,
              backgroundColor: theme.colors.white,
            }}
          />
          <TouchableOpacity onPress={() => removeItem(idx)}>
            <Text style={{ color: theme.colors.brand.red, marginTop: 4, fontWeight: "bold" }}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addItem} style={{ marginTop: 6 }}>
        <Text style={{ color: theme.colors.brand.blue, fontWeight: "bold" }}>+ Add Schedule Item</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ScheduleSection
