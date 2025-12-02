import type { FeaturedEventCardProps } from "@/lib/types"
import { BaseEventCard } from "./EventCardBase"

export function FeaturedEventCard({ event }: FeaturedEventCardProps) {
  return <BaseEventCard event={event} size="sm" />
}
