import { Event } from "@/interfaces/event"
import dayjs from "dayjs"

// Example mock events for testing
export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Music Festival",
    description: "Join us for a night of live music and fun!",
    theme: { name: "Music", icon: "music" },
    location: { city: "Los Angeles", country: "USA", address: "456 Music Ave." },
    startAt: dayjs("2024-08-20T19:00:00Z").toDate(),
    endAt: dayjs("2024-08-20T23:00:00Z").toDate(),
    creator: {
      id: "u1",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    images: [
      { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", likes: 818 },
      { src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca", likes: 100 },
    ],
    prompts: [
      { prompt: "What excites you most about live music?", answer: "The energy and atmosphere.", likes: 120 },
      { prompt: "Who would you bring to this event?", answer: "My best friends.", likes: 200 },
    ],
    interestedCount: 534,
  },
  {
    id: "2",
    title: "Art Exhibition",
    description: "Explore modern art from local artists.",
    theme: { name: "Art", icon: "paintbrush" },
    location: { city: "New York", country: "USA", address: "123 Art St." },
    startAt: dayjs("2024-07-15T18:00:00Z").toDate(),
    endAt: dayjs("2024-07-15T21:00:00Z").toDate(),
    creator: {
      id: "u2",
      name: "Bob Smith",
      email: "bob.smith@example.com",
      avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    images: [
      { src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308", likes: 76 },
      { src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e", likes: 54 },
    ],
    prompts: [
      { prompt: "Which art style do you love?", answer: "Abstract expressionism.", likes: 10 },
      { prompt: "Would you create your own art?", answer: "Absolutely, I love painting.", likes: 23 },
    ],
    interestedCount: 1240,
  },
  {
    id: "3",
    title: "Tech Conference",
    description: "Discover the latest in technology and innovation.",
    theme: { name: "Tech", icon: "laptop-code" },
    location: { city: "San Francisco", country: "USA", address: "789 Tech Blvd." },
    startAt: dayjs("2024-09-10T09:00:00Z").toDate(),
    endAt: dayjs("2024-09-10T17:00:00Z").toDate(),
    creator: {
      id: "u3",
      name: "Carol Davis",
      email: "carol.davis@example.com",
      avatarUrl: "https://randomuser.me/api/portraits/women/46.jpg",
    },
    images: [
      { src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c", likes: 150 },
      { src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d", likes: 95 },
    ],
    prompts: [
      { prompt: "What tech trend are you most excited about?", answer: "Artificial Intelligence.", likes: 12 },
      { prompt: "Do you code or build tech projects?", answer: "Yes, I love coding apps.", likes: 8 },
    ],
    interestedCount: 875,
  },
]
export default mockEvents
