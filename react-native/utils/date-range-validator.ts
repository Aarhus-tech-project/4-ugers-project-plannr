// utils/date-range-validator.ts
// Utility for validating EventDateRange
import { EventDateRange } from "@/interfaces/event"

export function isValidEventDateRange(dateRange: EventDateRange): boolean {
  if (!dateRange.startAt) return false
  if (dateRange.endAt && dateRange.endAt <= dateRange.startAt) return false
  return true
}

export function getEventDateRangeError(dateRange: EventDateRange): string | null {
  if (!dateRange.startAt) return "Start date/time is required"
  if (dateRange.endAt && dateRange.endAt <= dateRange.startAt) return "End must be after start"
  return null
}
