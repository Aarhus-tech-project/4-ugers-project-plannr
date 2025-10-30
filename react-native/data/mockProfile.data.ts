// mockProfile.data.ts
// Example mock profile data for development

import { Profile } from "@/interfaces/profile"
import dayjs from "dayjs"
import mockEvents from "./mockEvents.data"

export const mockProfile: Profile = {
  id: "1",
  email: "alice.johnson@example.com",
  name: "Alice Johnson",
  bio: "I love coding and coffee!",
  phone: "+45 1234 5678",
  avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  filters: {
    formats: ["inperson", "online"],
    eventThemes: [],
    dateRange: {
      current: {
        day: false,
        week: false,
        month: false,
        year: false,
      },
      custom: {
        startDate: dayjs().toDate(),
        endDate: dayjs().add(2, "years").toDate(),
      },
    },
    location: {
      useCurrent: true,
      range: 200,
      custom: {
        latitude: 55.6761, // Copenhagen
        longitude: 12.5683, // Copenhagen
      },
    },
  },
  likedEvents: mockEvents.map((event) => event.id),
  subscribedEvents: [mockEvents[0].id, mockEvents[2].id],
}
