import { Filter } from "./filter"

export interface Profile {
  id: string
  email: string
  name: string
  bio?: string
  phone?: string
  avatarUrl?: string
  eventFinderSettings?: Filter
  likedEvents?: string[]
  subscribedEvents?: string[]
  filters?: Filter
}
