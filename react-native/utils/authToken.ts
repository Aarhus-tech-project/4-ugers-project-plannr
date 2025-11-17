import { SessionType } from "@/interfaces/session"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"

const SESSION_KEY = "user_session"

/**
 * Retrieves the current authentication token from AsyncStorage (migrated from SecureStore).
 * @returns {Promise<string>} The token string, or an empty string if not found.
 */
export async function getAuthToken(): Promise<string> {
  try {
    // Try AsyncStorage first
    let stored = await AsyncStorage.getItem(SESSION_KEY)
    if (!stored) {
      // Fallback to SecureStore for migration
      stored = await SecureStore.getItemAsync(SESSION_KEY)
      if (stored) {
        await AsyncStorage.setItem(SESSION_KEY, stored)
        await SecureStore.deleteItemAsync(SESSION_KEY)
      }
    }
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
