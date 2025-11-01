import { EventDateTimeStepValidation } from "@/components/event-creation/EventDateTimeStep"
import { EventDetailsStepValidation } from "@/components/event-creation/EventDetailsStep"
import { EventThemeName } from "@/interfaces/event"
import { FilterDateRange } from "@/interfaces/filter"
import React, { createContext, ReactNode, useContext, useState } from "react"

export interface EventDetails {
  title: string
  themes: EventThemeName[]
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
}

const EventCreationContext = createContext<EventCreationContextType | undefined>(undefined)

export const EventCreationProvider = ({ children }: { children: ReactNode }) => {
  const [eventDetails, setEventDetails] = useState<EventDetails>({ title: "", themes: [] })
  const [detailsValidation, setDetailsValidation] = useState<EventDetailsStepValidation>({})
  // Date range state (like useFilters)
  const [dateRange, setDateRange] = useState<FilterDateRange>({
    current: { day: true, week: false, month: false, year: false },
  })
  const [customStart, setCustomStart] = useState<Date | null>(null)
  const [customEnd, setCustomEnd] = useState<Date | null>(null)
  const [dateTimeValidation, setDateTimeValidation] = useState<EventDateTimeStepValidation>({})

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
