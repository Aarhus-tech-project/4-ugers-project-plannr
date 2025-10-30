import { useCustomTheme } from "@/hooks/useCustomTheme"
import { Event } from "@/interfaces/event"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import React from "react"
import { StyleSheet } from "react-native"
import { Button, Card, Text } from "react-native-paper"
dayjs.extend(utc)

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
        {event.location?.city && event.location?.country && (
          <Text style={{ marginTop: 4, color: theme.colors.onSurfaceVariant }}>
            {event.location.city}, {event.location.country}
          </Text>
        )}
        <Text style={{ marginTop: 2, color: theme.colors.onSurfaceVariant }}>
          {event.dateRange?.startAt ? dayjs.utc(event.dateRange.startAt).local().format("DD MMM YYYY - HH:mm") : ""}
          {event.dateRange?.endAt ? ` - ${dayjs.utc(event.dateRange.endAt).local().format("DD MMM YYYY - HH:mm")}` : ""}
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
