import { SessionType } from "@/types/session"
import * as SecureStore from "expo-secure-store"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

const SESSION_KEY = "user_session"
const SessionContext = createContext<{
  session: SessionType | null
  setSession: (session: SessionType | null) => void
  loading: boolean
}>({
  session: null,
  setSession: () => {},
  loading: true,
})

export function useSession() {
  return useContext(SessionContext)
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<SessionType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const stored = await SecureStore.getItemAsync(SESSION_KEY)
      if (stored) {
        try {
          setSessionState(JSON.parse(stored))
        } catch (err) {
          console.warn("Failed to parse session:", err)
          setSessionState(null)
        }
      }
      setLoading(false)
    })()
  }, [])

  const setSession = useCallback(async (newSession: SessionType | null) => {
    setSessionState(newSession)
    if (newSession) {
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(newSession))
    } else {
      await SecureStore.deleteItemAsync(SESSION_KEY)
    }
  }, [])

  return <SessionContext.Provider value={{ session, setSession, loading }}>{children}</SessionContext.Provider>
}
