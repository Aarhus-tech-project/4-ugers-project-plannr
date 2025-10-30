import { Event } from "./event"
import { Filter } from "./filter"

export interface Profile {
  id: string
  email: string
  name: string
  bio?: string
  phone?: string
  avatarUrl?: string
  eventFinderSettings?: Filter
  likedEvents?: Event[]
  subscribedEvents?: Event[]
  filters?: Filter
}
