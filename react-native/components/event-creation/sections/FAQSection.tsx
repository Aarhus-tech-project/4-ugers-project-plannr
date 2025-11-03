import { useCustomTheme } from "@/hooks/useCustomTheme"
import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  items: FAQItem[]
  onChange: (items: FAQItem[]) => void
}

const FAQSection: React.FC<FAQSectionProps> = ({ items, onChange }) => {
  const theme = useCustomTheme()
  const addItem = () => onChange([...items, { question: "", answer: "" }])
  const updateItem = (idx: number, key: "question" | "answer", value: string) => {
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
            value={item.question}
            onChangeText={(v) => updateItem(idx, "question", v)}
            placeholder="Question"
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
            value={item.answer}
            onChangeText={(v) => updateItem(idx, "answer", v)}
            placeholder="Answer"
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
        <Text style={{ color: theme.colors.brand.blue, fontWeight: "bold" }}>+ Add FAQ</Text>
      </TouchableOpacity>
    </View>
  )
}

export default FAQSection
