import { api } from "@/config/api"
import { SessionType } from "@/interfaces/session"
import * as SecureStore from "expo-secure-store"
import { useEffect, useState } from "react"
import { useAsyncFn } from "./useAsyncFn"

const SESSION_KEY = "user_session"

export function useAuth() {
  const [session, setSession] = useState<SessionType | null>(null)

  useEffect(() => {
    SecureStore.getItemAsync(SESSION_KEY)
      .then((stored) => {
        if (stored) setSession(JSON.parse(stored))
        else setSession(null)
      })
      .catch(() => setSession(null))
  }, [])

  const login = useAsyncFn(async (email: string, password: string) => {
    const data = await api.auth.login(email, password)
    if (!data || !data.profileId || !data.token) {
      throw new Error("Invalid login response: missing profileId or token")
    }
    const profile = await api.profiles.get(data.profileId)
    const sessionObj: SessionType = {
      profile,
      provider: "manual",
      token: data.token,
    }
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(sessionObj))
    setSession(sessionObj)
    return sessionObj
  })

  const logout = useAsyncFn(async () => {
    await SecureStore.deleteItemAsync(SESSION_KEY)
    setSession(null)
    return null
  })

  return { login, logout, session }
}
