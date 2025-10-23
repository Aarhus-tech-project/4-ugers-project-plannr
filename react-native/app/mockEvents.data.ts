import { Event } from "@/interfaces/event"

// Example mock events for testing
export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Music Festival",
    description: "Join us for a night of live music and fun!",
    theme: "music",
    location: { city: "Los Angeles", country: "USA" },
    startTime: "2024-08-20T19:00:00Z",
    endTime: "2024-08-20T23:00:00Z",
    images: [
      { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", likes: 0 },
      { src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca", likes: 0 },
    ],
    prompts: [
      { prompt: "What excites you most about live music?", answer: "The energy and atmosphere.", likes: 0 },
      { prompt: "Who would you bring to this event?", answer: "My best friends.", likes: 0 },
    ],
    interestedCount: 534,
  },
  {
    id: "2",
    title: "Art Exhibition",
    description: "Explore modern art from local artists.",
    theme: "art",
    location: { city: "New York", country: "USA" },
    startTime: "2024-07-15T18:00:00Z",
    endTime: "2024-07-15T21:00:00Z",
    images: [
      { src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308", likes: 0 },
      { src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e", likes: 0 },
    ],
    prompts: [
      { prompt: "Which art style do you love?", answer: "Abstract expressionism.", likes: 0 },
      { prompt: "Would you create your own art?", answer: "Absolutely, I love painting.", likes: 0 },
    ],
    interestedCount: 1240,
  },
  {
    id: "3",
    title: "Tech Conference",
    description: "Discover the latest in technology and innovation.",
    theme: "technology",
    location: { city: "San Francisco", country: "USA" },
    startTime: "2024-09-10T09:00:00Z",
    endTime: "2024-09-10T17:00:00Z",
    images: [
      { src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c", likes: 0 },
      { src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d", likes: 0 },
    ],
    prompts: [
      { prompt: "What tech trend are you most excited about?", answer: "Artificial Intelligence.", likes: 0 },
      { prompt: "Do you code or build tech projects?", answer: "Yes, I love coding apps.", likes: 0 },
    ],
    interestedCount: 875,
  },
]
