import type { EventCardProps } from "@/lib/types"
import { BaseEventCard } from "./EventCardBase"

export function EventCard({ event }: EventCardProps) {
  return <BaseEventCard event={event} size="md" />
}
