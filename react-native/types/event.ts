export interface EventPrompt {
  prompt: string
  answer: string
  likes: number
}

export interface EventImage {
  src: string
  likes: number
}

export interface Event {
  id: string
  title: string
  description: string
  images: EventImage[]
  prompts: EventPrompt[]
  interestedCount: number
  startTime: string
  endTime: string
  location?: {
    city: string
    country: string
  }
  theme?: string
}
