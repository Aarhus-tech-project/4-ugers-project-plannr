import { useCustomTheme } from "@/hooks/useCustomTheme"
import { Event } from "@/interfaces/event"
import React from "react"
import { StyleSheet } from "react-native"
import { Button, Card, Text } from "react-native-paper"

interface EventCardProps {
  event: Event
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const theme = useCustomTheme()
  return (
    <Card style={styles.card}>
      <Card.Title title={event.title} subtitle={event.theme?.name} />
      <Card.Content>
        <Text>{event.description}</Text>
        {event.country && event.city && (
          <Text style={{ marginTop: 4, color: theme.colors.onSurfaceVariant }}>
            {event.city}, {event.country}
          </Text>
        )}
        <Text style={{ marginTop: 2, color: theme.colors.onSurfaceVariant }}>
          {event.startAt.toLocaleString()} - {event.endAt ? event.endAt.toLocaleString() : ""}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="text" onPress={() => {}}>
          Details
        </Button>
      </Card.Actions>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 16,
  },
})

export default EventCard
