import { Profile } from "./profile"

export interface EventLocation {
  city: string
  country: string
  address: string
  geolocation?: {
    latitude: number
    longitude: number
  }
}

type EventThemeName = "Music" | "Art" | "Sports" | "Tech" | "Food" | "Networking" | "Health" | "Education"
// FA6 Icon nanes for reference: https://fontawesome.com/icons?d=gallery&s=solid&m=free
type EventThemeIcon = "music" | "paintbrush" | "futbol" | "laptop-code" | "utensils" | "users" | "heart-pulse" | "book"

export interface EventTheme {
  name: EventThemeName
  icon: EventThemeIcon
}

export interface EventImage {
  src: string
  likes: number
}
export interface EventPrompt {
  prompt: string
  answer: string
  likes: number
}

export interface Event {
  id: string
  title: string
  description: string
  images: EventImage[]
  prompts: EventPrompt[]
  interestedCount: number
  startAt: Date
  endAt: Date
  allDay?: boolean
  location?: EventLocation
  theme?: EventTheme
  creator: Profile
}
