// Utility to validate event sections for completeness
import { EventPageSection } from "@/interfaces/event"

export function isSectionFilled(section: EventPageSection): boolean {
  switch (section.type) {
    case "description":
      return !!section.content && section.content.trim().length > 0
    case "faq":
      return (
        Array.isArray(section.items) &&
        section.items.length > 0 &&
        section.items.every((item: any) => item.question && item.answer)
      )
    case "guests":
      return (
        Array.isArray(section.guests) &&
        section.guests.length > 0 &&
        section.guests.every((g: any) => g.name && g.name.trim().length > 0)
      )
    case "tickets":
      return (
        Array.isArray(section.tickets) &&
        section.tickets.length > 0 &&
        section.tickets.every((t: any) => t.type && t.type.trim().length > 0 && typeof t.price === "number")
      )
    case "resources":
      return (
        Array.isArray(section.files) && section.files.length > 0 && section.files.every((f: any) => f.name && f.url)
      )
    case "dresscode":
      return !!section.content && section.content.trim().length > 0
    case "schedule":
      return (
        Array.isArray(section.items) &&
        section.items.length > 0 &&
        section.items.every((i: any) => i.activity && i.time)
      )
    default:
      return true
  }
}

export function areAllSectionsFilled(sections: EventPageSection[]): boolean {
  return sections && sections.length > 0 && sections.every(isSectionFilled)
}
