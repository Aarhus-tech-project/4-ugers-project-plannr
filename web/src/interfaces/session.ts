import { Profile } from "./profile"

export type ProviderType = "github" | "google" | "manual" | "slack"

export interface Session {
  profile: Profile
  provider: ProviderType
  token: string
}

export type SessionType = null | Session
