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
        // Call your backend API to validate credentials
        const res = await fetch(`${process.env.API_BASE_URL || "http://localhost:5000/api"}/profiles/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        })
        if (!res.ok) return null
        const user = await res.json()
        // Return user object if valid, or null if invalid
        return user && user.id ? user : null
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
