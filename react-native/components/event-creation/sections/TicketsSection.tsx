import { useCustomTheme } from "@/hooks/useCustomTheme"
import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

interface Ticket {
  type: string
  price: number
  currency?: string
  link?: string
}

interface TicketsSectionProps {
  tickets: Ticket[]
  onChange: (tickets: Ticket[]) => void
  error?: string
}

const TicketsSection: React.FC<TicketsSectionProps> = ({ tickets, onChange, error }) => {
  const theme = useCustomTheme()
  const addTicket = () => onChange([...tickets, { type: "", price: 0 }])
  const updateTicket = (idx: number, key: keyof Ticket, value: string | number) => {
    const updated = tickets.map((t, i) => (i === idx ? { ...t, [key]: value } : t))
    onChange(updated)
  }
  const removeTicket = (idx: number) => onChange(tickets.filter((_, i) => i !== idx))

  return (
    <View style={{ marginVertical: 8 }}>
      {tickets.map((t, idx) => (
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
            value={t.type}
            onChangeText={(v) => updateTicket(idx, "type", v)}
            placeholder="Ticket Type"
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
            value={t.price.toString()}
            onChangeText={(v) => updateTicket(idx, "price", parseFloat(v) || 0)}
            placeholder="Price"
            keyboardType="numeric"
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
            value={t.currency}
            onChangeText={(v) => updateTicket(idx, "currency", v)}
            placeholder="Currency (optional)"
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
            value={t.link}
            onChangeText={(v) => updateTicket(idx, "link", v)}
            placeholder="Link (optional)"
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
          <TouchableOpacity onPress={() => removeTicket(idx)}>
            <Text style={{ color: theme.colors.brand.red, marginTop: 4, fontWeight: "bold" }}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addTicket} style={{ marginTop: 6 }}>
        <Text style={{ color: theme.colors.brand.blue, fontWeight: "bold" }}>+ Add Ticket</Text>
      </TouchableOpacity>
      {typeof error === "string" && error.length > 0 && (
        <Text style={{ color: theme.colors.brand.red, marginTop: 4, fontSize: 13 }}>{error}</Text>
      )}
    </View>
  )
}

export default TicketsSection
