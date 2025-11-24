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
        // Replace with your own secure user lookup
        if (credentials?.username === "admin" && credentials?.password === "pass") {
          return { id: "1", name: "Admin" }
        }
        // If credentials are invalid, return null to signal failed login
        return null
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
