import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    jwt: string
    profileId: string
    user: {
      id: string
      name: string
      email: string
      avatarUrl?: string | null
      bio?: string | null
      phone?: string | null
    }
  }

  interface User {
    token: string
    profileId: string
    email: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    jwt?: string
    profileId?: string
    email?: string
  }
}
