import EventPage from "@/components/EventPage"
import { useEventCreation } from "@/context/EventCreationContext"
import React from "react"

const EventReviewStep: React.FC = () => {
  const { eventDetails, customStart, customEnd, images, sections, selectedLocation } = useEventCreation()

  // Compose a mock event object for preview
  const previewEvent = {
    id: "preview",
    title: eventDetails.title,
    format: "inperson",
    dateRange: {
      startAt: customStart || new Date(),
      endAt: customEnd || undefined,
    },
    location: selectedLocation
      ? {
          address: "",
          city: "",
          country: "",
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        }
      : undefined,
    themes: eventDetails.themes || [],
    sections: [
      ...(images && images.length > 0 ? [{ type: "images", srcs: images.map((img: { uri: string }) => img.uri) }] : []),
      ...(sections || []),
    ],
  }

  return <EventPage event={previewEvent} showHeader={false} />
}

export default EventReviewStep
