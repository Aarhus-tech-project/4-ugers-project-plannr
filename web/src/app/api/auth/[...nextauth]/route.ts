import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Authorize user credentials for login.
       * Replace this logic with a secure user lookup (e.g., database query).
       *
       * @param credentials - The credentials object containing username and password.
       * @returns The user object if credentials are valid, or null if invalid.
       */
      async authorize(credentials) {
        // Call backend login endpoint
        try {
          const res = await fetch("https://plannr.azurewebsites.net/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.username,
              password: credentials?.password,
            }),
          })
          if (!res.ok) return null
          const data = await res.json()
          // Expecting { profileId, token }
          if (data?.profileId && data?.token) {
            return {
              id: data.profileId,
              token: data.token,
              name: credentials?.username,
            }
          }
          return null
        } catch (err) {
          console.error("Login error:", err)
          return null
        }
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
