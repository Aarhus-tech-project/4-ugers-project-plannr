import type { Event, EventThemeName } from "./models/event"

// Component Props Types

export interface EventCardProps {
  event: Event
  onInterested?: (eventId: string) => void
  onGoing?: (eventId: string) => void
}

export interface FeaturedEventCardProps {
  event: Event
}

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export interface ThemeSelectorProps {
  selectedThemes: EventThemeName[]
  onChange: (themes: EventThemeName[]) => void
}

export interface CategoryTagsProps {
  categories: string[]
  maxDisplay?: number
}

export interface MapPickerProps {
  position: { lat: number; lng: number }
  onPositionChange: (position: { lat: number; lng: number }) => void
  height?: string
}

export interface TestimonialCardProps {
  name: string
  avatarUrl?: string
  quote: string
}

export interface NavbarProps {
  userName?: string
  userAvatar?: string
}

// Step Component Props for Event Creation
export interface DetailsStepProps {
  title: string
  description: string
  themes: EventThemeName[]
  onChange: (data: { title: string; description: string; themes: EventThemeName[] }) => void
}

export interface DateTimeStepProps {
  date: string
  time: string
  onChange: (data: { date: string; time: string }) => void
}

export interface LocationStepProps {
  lat: number
  lng: number
  address?: string
  city?: string
  country?: string
  onChange: (data: { lat: number; lng: number; address?: string; city?: string; country?: string }) => void
}

export interface ImagesStepProps {
  images: string[]
  onChange: (data: { images: string[] }) => void
}

export interface ReviewStepProps {
  details: { title: string; description: string; themes: EventThemeName[] }
  dateTime: { date: string; time: string }
  location: { lat: number; lng: number; address?: string; city?: string; country?: string }
  images: { images: string[] }
  onSubmit: () => void
  onEdit: (step: number) => void
  error?: string | null
}

// Form Types
export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  email: string
  password: string
  name: string
  phone?: string
}

export interface ProfileFormData {
  name: string
  email: string
  bio?: string
  phone?: string
  image?: string
}
