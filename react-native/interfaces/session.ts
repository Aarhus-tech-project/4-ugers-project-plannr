export type ProviderType = "github" | "google" | "manual" | "slack"

export type SessionUser = {
  name: string | null
  lastName: string | null
  email: string | null
  avatarUrl: string
}

export interface Session {
  user: SessionUser
  provider: ProviderType
  token: string
}

export type SessionType = null | Session
