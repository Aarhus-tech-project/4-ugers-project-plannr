import { SessionType } from "@/interfaces/session"
import * as SecureStore from "expo-secure-store"

const SESSION_KEY = "user_session"

/**
 * Retrieves the current authentication token from SecureStore.
 * @returns {Promise<string>} The token string, or an empty string if not found.
 */
export async function getAuthToken(): Promise<string> {
  try {
    const stored = await SecureStore.getItemAsync(SESSION_KEY)
    if (!stored) return ""
    const session: SessionType = JSON.parse(stored)
    if (session && typeof session === "object" && "token" in session) {
      return session.token || ""
    }
    return ""
  } catch {
    return ""
  }
}
