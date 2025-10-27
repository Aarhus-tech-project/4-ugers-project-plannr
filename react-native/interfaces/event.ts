export type EventThemeName =
  | "Music"
  | "Art"
  | "Sports"
  | "Tech"
  | "Food"
  | "Networking"
  | "Health"
  | "Education"
  | "Business"
  | "Nature"
  | "Travel"
  | "Charity"
  | "Fashion"
  | "Film"
  | "Photography"
  | "Literature"
  | "Science"
  | "Gaming"
  | "Spirituality"
  | "Family"
  | "Comedy"
  | "Dance"
  | "History"
  | "Politics"
  | "Environment"
  | "Pets"
  | "Shopping"
  | "Fitness"
  | "Theater"
  | "Crafts"
  | "Languages"
  | "Social"
  | "Adventure"
  | "Startup"
  | "Book Club"
  | "Coding"
  | "Volunteering"
  | "Wellness"
  | "Exhibition"
  | "Tournament"
  | "Workshop"
  | "Meetup"
  | "Lecture"
  | "Hackathon"
  | "Fundraiser"
  | "Open Mic"
  | "Quiz"
  | "Tour"
  | "Market"
  | "Parade"
  | "Festival"
  | "Conference"
  | "Seminar"
  | "Retreat"
  | "Webinar"
  | "Show"
  | "Party"
  | "Picnic"
  | "Class"
  | "Ceremony"
  | "Celebration"
  | "Other"
// FA6 Icon names for reference: https://fontawesome.com/icons?d=gallery&s=solid&m=free
type EventThemeIcon =
  | "music"
  | "paintbrush"
  | "futbol"
  | "laptop-code"
  | "utensils"
  | "users"
  | "heart-pulse"
  | "book"
  | "briefcase"
  | "leaf"
  | "plane"
  | "hand-holding-heart"
  | "shirt"
  | "film"
  | "camera"
  | "feather"
  | "flask"
  | "gamepad"
  | "peace"
  | "child"
  | "face-laugh"
  | "person-dancing"
  | "landmark"
  | "landmark-dome"
  | "scale-balanced"
  | "recycle"
  | "paw"
  | "cart-shopping"
  | "dumbbell"
  | "masks-theater"
  | "scissors"
  | "language"
  | "people-group"
  | "mountain"
  | "rocket"
  | "book-open"
  | "code"
  | "hands-helping"
  | "spa"
  | "image"
  | "trophy"
  | "chalkboard"
  | "handshake"
  | "microphone"
  | "question"
  | "route"
  | "store"
  | "person-walking"
  | "people-carry-box"
  | "flag"
  | "people-arrows"
  | "calendar"
  | "people-line"
  | "star"
  | "cake-candles"
  | "graduation-cap"
  | "medal"
  | "other"

export interface EventTheme {
  name: EventThemeName
  icon: EventThemeIcon
}

export type EventFormat = "inperson" | "online" | "hybrid"
// Section types for customizable event pages
export type EventPageSection =
  | { type: "description"; content: string }
  | { type: "location"; address: string; latitude?: number; longitude?: number }
  | { type: "faq"; items: Array<{ question: string; answer: string }> }
  | { type: "guests"; guests: Array<{ name: string; bio?: string; avatarUrl?: string; social?: string }> }
  | { type: "tickets"; tickets: Array<{ type: string; price: number; link?: string }> }
  | { type: "resources"; files: Array<{ name: string; url: string }> }
  | { type: "dresscode"; content: string }
export interface Event {
  id: string
  title: string
  description: string
  format: EventFormat
  images: { src: string }[]
  interestedCount?: number
  goingCount?: number
  checkedInCount?: number
  startAt: Date
  endAt?: Date
  allDay?: boolean
  city: string
  country: string
  address: string
  venue?: string
  latitude?: number
  longitude?: number
  accessLink?: string
  requiredAge?: number
  theme?: EventTheme
  creator: {
    id: string
    name: string
    email: string
    avatarUrl?: string
  }
  sections?: EventPageSection[] // Customizable event page sections
}
