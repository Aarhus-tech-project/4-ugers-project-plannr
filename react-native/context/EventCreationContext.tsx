import { EventDateTimeStepValidation } from "@/components/event-creation/EventDateTimeStep"
import { EventDetailsStepValidation } from "@/components/event-creation/EventDetailsStep"
import { useLiveLocation } from "@/hooks/useLiveLocation"
import { useSession } from "@/hooks/useSession"
import { EventFormat, EventLocation, EventPageSection, EventThemeName } from "@/interfaces/event"
import { FilterDateRange } from "@/interfaces/filter"
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"

export interface EventDetails {
  title: string
  themes: EventThemeName[]
  format: EventFormat
}

export interface EventDateTime {
  start: string
  end: string
}

interface EventCreationContextType {
  eventDetails: EventDetails
  setEventDetails: (val: EventDetails) => void
  detailsValidation: EventDetailsStepValidation
  setDetailsValidation: (v: EventDetailsStepValidation) => void
  dateRange: FilterDateRange
  setDateRange: (range: FilterDateRange) => void
  customStart: Date | null
  setCustomStart: (date: Date | null) => void
  customEnd: Date | null
  setCustomEnd: (date: Date | null) => void
  dateTimeValidation: EventDateTimeStepValidation
  setDateTimeValidation: (v: EventDateTimeStepValidation) => void
  selectedLocation: EventLocation | null
  setSelectedLocation: (val: EventLocation | null) => void
  sections: EventPageSection[]
  setSections: (sections: EventPageSection[]) => void
  buildEventFields: () => any
  access: any
  setAccess: (val: any) => void
  ageRestriction: number | null
  setAgeRestriction: (val: number | null) => void
}

interface EventCreationContextType {
  eventDetails: EventDetails
  setEventDetails: (val: EventDetails) => void
  detailsValidation: EventDetailsStepValidation
  setDetailsValidation: (v: EventDetailsStepValidation) => void
  dateRange: FilterDateRange
  setDateRange: (range: FilterDateRange) => void
  customStart: Date | null
  setCustomStart: (date: Date | null) => void
  customEnd: Date | null
  setCustomEnd: (date: Date | null) => void
  dateTimeValidation: EventDateTimeStepValidation
  setDateTimeValidation: (v: EventDateTimeStepValidation) => void
  selectedLocation: EventLocation | null
  setSelectedLocation: (val: EventLocation | null) => void
  sections: EventPageSection[]
  setSections: (sections: EventPageSection[]) => void
  buildEventFields: () => any
}

const EventCreationContext = createContext<EventCreationContextType | undefined>(undefined)

export const EventCreationProvider = ({ children }: { children: ReactNode }) => {
  // New state for access, attendance, ageRestriction
  const [access, setAccess] = useState<any>(null)
  const [ageRestriction, setAgeRestriction] = useState<number | null>(null)
  const { session } = useSession()
  // Submit event logic
  // Only build event fields, do not post
  const buildEventFields = () => {
    if (!session?.profile?.id) {
      console.error("No session or profile id found!")
      return null
    }
    return {
      creatorId: session.profile.id,
      title: eventDetails.title,
      themes: eventDetails.themes,
      format: eventDetails.format,
      dateRange: {
        startAt: customStart ?? new Date(),
        endAt: customEnd ?? undefined,
      },
      location: selectedLocation ?? undefined,
      sections: sections,
      access,
      ageRestriction,
    }
  }
  const [eventDetails, setEventDetails] = useState<EventDetails>({ title: "", themes: [], format: "inperson" })
  const [detailsValidation, setDetailsValidation] = useState<EventDetailsStepValidation>({})
  // Date range state (like useFilters)
  const [dateRange, setDateRange] = useState<FilterDateRange>({
    current: { day: true, week: false, month: false, year: false },
  })
  const [customStart, setCustomStart] = useState<Date | null>(null)
  const [customEnd, setCustomEnd] = useState<Date | null>(null)
  const [dateTimeValidation, setDateTimeValidation] = useState<EventDateTimeStepValidation>({})

  // Sections state for event creation
  const [sections, setSections] = useState<EventPageSection[]>([])

  // Use live location for default selectedLocation
  const { location: liveLocation, address: liveAddress } = useLiveLocation()
  const [selectedLocation, setSelectedLocation] = useState<EventLocation | null>(null)

  // Set selectedLocation to live location if not set
  useEffect(() => {
    // If selectedLocation is missing address/city/country, update it when liveAddress is available
    if (
      selectedLocation &&
      (!selectedLocation.address || !selectedLocation.city || !selectedLocation.country) &&
      liveLocation?.coords &&
      liveAddress
    ) {
      setSelectedLocation({
        address: liveAddress.street
          ? `${liveAddress.street}${liveAddress.streetNumber ? " " + liveAddress.streetNumber : ""}`.trim()
          : "",
        city: liveAddress.city || "",
        country: liveAddress.country || "",
        venue: liveAddress.name || "",
        latitude: liveLocation.coords.latitude,
        longitude: liveLocation.coords.longitude,
      })
      setSelectedLocation({
        address: liveAddress?.street
          ? `${liveAddress.street}${liveAddress.streetNumber ? " " + liveAddress.streetNumber : ""}`.trim()
          : "",
        city: liveAddress?.city || "",
        country: liveAddress?.country || "",
        venue: liveAddress?.name || "",
        latitude: liveLocation.coords.latitude,
        longitude: liveLocation.coords.longitude,
      })
    }
  }, [selectedLocation, liveLocation, liveAddress])

  return (
    <EventCreationContext.Provider
      value={{
        eventDetails,
        setEventDetails,
        detailsValidation,
        setDetailsValidation,
        dateRange,
        setDateRange,
        customStart,
        setCustomStart,
        customEnd,
        setCustomEnd,
        dateTimeValidation,
        setDateTimeValidation,
        selectedLocation,
        setSelectedLocation,
        sections,
        setSections,
        buildEventFields,
        access,
        setAccess,
        ageRestriction,
        setAgeRestriction,
      }}
    >
      {children}
    </EventCreationContext.Provider>
  )
}

export const useEventCreation = () => {
  const context = useContext(EventCreationContext)
  if (!context) {
    throw new Error("useEventCreation must be used within an EventCreationProvider")
  }
  return context
}
