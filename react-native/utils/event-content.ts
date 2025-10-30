import { Event, EventPageSection, EventTheme } from "@/interfaces/event"

export function getSortedEventCards(event: Event) {
  const sections = [...(event.sections ?? [])]
  const result: Array<{ type: string; section?: EventPageSection; event: Event }> = []

  // Helper to find and remove a section by type
  function extractSection(type: string): EventPageSection | undefined {
    const idx = sections.findIndex((s) => s.type === type)
    if (idx !== -1) {
      return sections.splice(idx, 1)[0]
    }
    return undefined
  }

  // 1. Images card (if present)
  const images = extractSection("images")
  if (images) result.push({ type: "section", section: images, event })

  // 2. Details card
  result.push({ type: "details", event })

  // 3. Description
  const description = extractSection("description")
  if (description) result.push({ type: "section", section: description, event })

  // 4. Guests
  const guests = extractSection("guests")
  if (guests) result.push({ type: "section", section: guests, event })

  // 5. Schedule
  const schedule = extractSection("schedule")
  if (schedule) result.push({ type: "section", section: schedule, event })

  // 6. Tickets
  const tickets = extractSection("tickets")
  if (tickets) result.push({ type: "section", section: tickets, event })

  // 7. FAQ
  const faq = extractSection("faq")
  if (faq) result.push({ type: "section", section: faq, event })

  // 8. Resources
  const resources = extractSection("resources")
  if (resources) result.push({ type: "section", section: resources, event })

  // 9. Any remaining sections (e.g., dresscode, etc.)
  for (const section of sections) {
    result.push({ type: "section", section, event })
  }

  // 10. Location map section at the end (from event.location)
  if (event.location && event.location.latitude && event.location.longitude) {
    result.push({
      type: "section",
      section: {
        type: "map",
        latitude: event.location.latitude,
        longitude: event.location.longitude,
      } as EventPageSection,
      event,
    })
  }

  return result
}

export const eventThemes: EventTheme[] = [
  { name: "Music", icon: "music" },
  { name: "Art", icon: "paintbrush" },
  { name: "Sports", icon: "futbol" },
  { name: "Tech", icon: "laptop-code" },
  { name: "Food", icon: "utensils" },
  { name: "Networking", icon: "users" },
  { name: "Health", icon: "heart-pulse" },
  { name: "Education", icon: "book" },
  { name: "Business", icon: "briefcase" },
  { name: "Nature", icon: "leaf" },
  { name: "Travel", icon: "plane" },
  { name: "Charity", icon: "hand-holding-heart" },
  { name: "Fashion", icon: "shirt" },
  { name: "Film", icon: "film" },
  { name: "Photography", icon: "camera" },
  { name: "Literature", icon: "feather" },
  { name: "Science", icon: "flask" },
  { name: "Gaming", icon: "gamepad" },
  { name: "Spirituality", icon: "peace" },
  { name: "Family", icon: "child" },
  { name: "Comedy", icon: "face-laugh" },
  { name: "Dance", icon: "music" },
  { name: "History", icon: "landmark" },
  { name: "Politics", icon: "scale-balanced" },
  { name: "Environment", icon: "recycle" },
  { name: "Pets", icon: "paw" },
  { name: "Shopping", icon: "cart-shopping" },
  { name: "Fitness", icon: "dumbbell" },
  { name: "Theater", icon: "masks-theater" },
  { name: "Crafts", icon: "scissors" },
  { name: "Languages", icon: "language" },
  { name: "Social", icon: "people-group" },
  { name: "Adventure", icon: "mountain" },
  { name: "Startup", icon: "rocket" },
  { name: "Book Club", icon: "book-open" },
  { name: "Coding", icon: "code" },
  { name: "Volunteering", icon: "hands-helping" },
  { name: "Wellness", icon: "spa" },
  { name: "Exhibition", icon: "image" },
  { name: "Tournament", icon: "trophy" },
  { name: "Workshop", icon: "chalkboard" },
  { name: "Meetup", icon: "handshake" },
  { name: "Lecture", icon: "microphone" },
  { name: "Hackathon", icon: "question" },
  { name: "Fundraiser", icon: "hand-holding-heart" },
  { name: "Open Mic", icon: "microphone" },
  { name: "Quiz", icon: "question" },
  { name: "Tour", icon: "route" },
  { name: "Market", icon: "store" },
  { name: "Parade", icon: "person-walking" },
  { name: "Festival", icon: "people-carry-box" },
  { name: "Conference", icon: "flag" },
  { name: "Seminar", icon: "people-arrows" },
  { name: "Retreat", icon: "calendar" },
  { name: "Webinar", icon: "people-line" },
  { name: "Show", icon: "star" },
  { name: "Party", icon: "cake-candles" },
  { name: "Picnic", icon: "child" },
  { name: "Class", icon: "graduation-cap" },
  { name: "Ceremony", icon: "medal" },
  { name: "Celebration", icon: "cake-candles" },
  { name: "Other", icon: "question" },
]
