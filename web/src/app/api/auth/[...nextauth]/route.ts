import API_ENDPOINTS from "@/utils/api-endpoints"
import NextAuth, { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Use centralized API endpoint for login
        const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        })
        if (!res.ok) {
          let errorMsg = "Unknown error"
          try {
            const errorData = await res.json()
            errorMsg = errorData?.message || errorData?.error || JSON.stringify(errorData)
          } catch {
            errorMsg = await res.text()
          }
          console.error("Login failed:", errorMsg)
          return null
        }
        const data = await res.json()
        console.log("Login response from backend:", data)
        // Return user object if valid, or null if invalid
        // Attach email if present in JWT payload
        let userObj = data && data.token && data.profileId ? data : null
        if (userObj && data.token) {
          try {
            const jwtPayload = JSON.parse(Buffer.from(data.token.split(".")[1], "base64").toString())
            userObj.email = jwtPayload.email
          } catch {}
        }
        return userObj
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect errors to login
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      // On login, merge backend JWT, email, and profileId into token
      if (user) {
        token.jwt = user.token
        token.email = user.email
        token.profileId = user.profileId
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Assign JWT and profileId to session
      ;(session as any).jwt = typeof token.jwt === "string" ? token.jwt : ""
      ;(session as any).profileId = typeof token.profileId === "string" ? token.profileId : ""

      // Fetch user profile using profileId from token
      if (token.jwt && token.profileId) {
        try {
          const res = await fetch(API_ENDPOINTS.PROFILES.BY_ID(String(token.profileId)), {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token.jwt}`,
              "Content-Type": "application/json",
            },
          })

          console.log("RES fetch profile for session", res)
          if (res.ok) {
            const sessionProfile = await res.json()
            ;(session as any).profile = sessionProfile
          } else {
            console.error("Failed to fetch profile for session", await res.text())
          }
        } catch (err) {
          console.error("Error fetching profile for session", err)
        }
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
