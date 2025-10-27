// mockProfile.data.ts
// Example mock profile data for development

import { Profile } from "@/interfaces/profile"
import mockEvents from "./mockEvents.data"

export const mockProfile: Profile = {
  id: "1",
  email: "alice.johnson@example.com",
  name: "Alice Johnson",
  bio: "I love coding and coffee!",
  phone: "+45 1234 5678",
  avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  // Add likedEvents and/or subscribedEvents for demo
  likedEvents: [mockEvents[0], mockEvents[2]],
  subscribedEvents: [mockEvents[1]],
}
