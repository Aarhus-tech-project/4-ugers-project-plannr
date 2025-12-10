import { getServerSession } from "next-auth"
import { authOptions } from "./config"

/**
 * Get session on server side
 */
export async function getSession() {
  return getServerSession(authOptions)
}

/**
 * Get JWT token from session
 */
export async function getSessionJwt(): Promise<string | null> {
  const session = await getSession()
  return session?.jwt || null
}

/**
 * Get profile ID from session
 */
export async function getSessionProfileId(): Promise<string | null> {
  const session = await getSession()
  return session?.profileId || null
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth() {
  const session = await getSession()

  if (!session?.jwt) {
    throw new Error("Unauthorized")
  }

  return {
    jwt: session.jwt,
    profileId: session.profileId,
    session,
  }
}
