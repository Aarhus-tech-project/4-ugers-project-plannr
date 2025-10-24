export type ProviderType = "github" | "google"

export interface GithubUser {
  name: string | null
  avatarUrl: string
  email: string | null
  location: string | null
}

export type SessionUser = GithubUser

export interface Session {
  user: SessionUser
  provider: ProviderType
  token: string
}

export type SessionType = null | Session
