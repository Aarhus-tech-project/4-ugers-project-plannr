import type { Filter } from "./filter"

export interface Profile {
  id: string
  email: string
  name: string
  bio?: string
  phone?: string
  avatarUrl?: string
  eventFinderSettings?: Filter
  interestedEvents?: string[]
  goingToEvents?: string[]
  checkedInEvents?: string[]
  notInterestedEvents?: string[]
  filters?: Filter
}

export interface ProfileUpdateDto {
  name?: string
  email?: string
  bio?: string
  phone?: string
  avatarUrl?: string
}
