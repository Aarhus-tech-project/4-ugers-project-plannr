import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    jwt: string
    profileId: string
    profile?: {
      id: string
      email: string
      name: string
      [key: string]: unknown
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
