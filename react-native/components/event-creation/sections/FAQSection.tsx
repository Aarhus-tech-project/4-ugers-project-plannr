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
  error?: string
}

const FAQSection: React.FC<FAQSectionProps> = ({ items, onChange, error }) => {
  const theme = useCustomTheme()
  const addItem = () => onChange([...items, { question: "", answer: "" }])
  const updateItem = (idx: number, key: "question" | "answer", value: string) => {
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
        <Text style={{ color: theme.colors.gray[500], fontSize: 14 }}>
          Add common questions and answers to help your guests.
        </Text>
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
            value={item.question}
            onChangeText={(v) => updateItem(idx, "question", v)}
            placeholder="Question"
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
          <TextInput
            value={item.answer}
            onChangeText={(v) => updateItem(idx, "answer", v)}
            placeholder="Answer"
            placeholderTextColor={theme.colors.gray[400]}
            style={{
              borderWidth: 0,
              marginBottom: 8,
              borderRadius: 10,
              padding: 14,
              backgroundColor: theme.colors.secondary,
              color: theme.colors.onBackground,
              fontSize: 16,
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
      {typeof error === "string" && error.length > 0 && (
        <Text style={{ color: theme.colors.brand.red, marginTop: 4, fontSize: 13 }}>{error}</Text>
      )}
    </View>
  )
}

export default FAQSection
