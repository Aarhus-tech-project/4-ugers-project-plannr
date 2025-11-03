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
}

const TicketsSection: React.FC<TicketsSectionProps> = ({ tickets, onChange }) => {
  const addTicket = () => onChange([...tickets, { type: "", price: 0 }])
  const updateTicket = (idx: number, key: keyof Ticket, value: string | number) => {
    const updated = tickets.map((t, i) => (i === idx ? { ...t, [key]: value } : t))
    onChange(updated)
  }
  const removeTicket = (idx: number) => onChange(tickets.filter((_, i) => i !== idx))

  return (
    <View style={{ marginVertical: 12 }}>
      {tickets.map((t, idx) => (
        <View key={idx} style={{ marginBottom: 8 }}>
          <TextInput
            value={t.type}
            onChangeText={(v) => updateTicket(idx, "type", v)}
            placeholder="Ticket Type"
            style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, marginBottom: 4 }}
          />
          <TextInput
            value={t.price.toString()}
            onChangeText={(v) => updateTicket(idx, "price", parseFloat(v) || 0)}
            placeholder="Price"
            keyboardType="numeric"
            style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, marginBottom: 4 }}
          />
          <TextInput
            value={t.currency}
            onChangeText={(v) => updateTicket(idx, "currency", v)}
            placeholder="Currency (optional)"
            style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, marginBottom: 4 }}
          />
          <TextInput
            value={t.link}
            onChangeText={(v) => updateTicket(idx, "link", v)}
            placeholder="Link (optional)"
            style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 }}
          />
          <TouchableOpacity onPress={() => removeTicket(idx)}>
            <Text style={{ color: "#d33", marginTop: 2 }}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addTicket} style={{ marginTop: 6 }}>
        <Text style={{ color: "#1976d2", fontWeight: "bold" }}>+ Add Ticket</Text>
      </TouchableOpacity>
    </View>
  )
}

export default TicketsSection
