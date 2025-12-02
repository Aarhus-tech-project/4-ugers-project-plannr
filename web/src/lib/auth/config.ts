import { BACKEND_API } from "@/lib/api/config"
import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const res = await fetch(BACKEND_API.auth.login, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })

        if (!res.ok) {
          return null
        }

        const data = await res.json()

        if (!data?.token || !data?.profileId) {
          return null
        }

        // Extract email from JWT payload
        let email = credentials.email
        try {
          const jwtPayload = JSON.parse(Buffer.from(data.token.split(".")[1], "base64").toString())
          email = jwtPayload.email || email
        } catch {
          // Use credentials email as fallback
        }

        return {
          id: data.profileId,
          token: data.token,
          profileId: data.profileId,
          email,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.jwt = user.token
        token.email = user.email
        token.profileId = user.profileId
      }
      return token
    },
    async session({ session, token }) {
      session.jwt = (token.jwt as string) || ""
      session.profileId = (token.profileId as string) || ""

      // Fetch user profile for session
      if (token.jwt && token.profileId) {
        try {
          const res = await fetch(BACKEND_API.profiles.byId(String(token.profileId)), {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token.jwt}`,
              "Content-Type": "application/json",
            },
          })

          if (res.ok) {
            session.profile = await res.json()
          }
        } catch {
          // Silently fail - session will work without profile
        }
      }

      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
