import { Filter } from "@/interfaces/filter"
import { Profile } from "@/interfaces/profile"
import { SessionType } from "@/interfaces/session"
import * as SecureStore from "expo-secure-store"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

const SESSION_KEY = "user_session"

interface SessionContextType {
  session: SessionType | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: true,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
})

export function useSession() {
  return useContext(SessionContext)
}

export function useUserProfileFilters(profile?: Profile): Filter {
  return {
    formats: Array.isArray(profile?.filters?.formats) ? profile!.filters!.formats : [],
    eventThemes: Array.isArray(profile?.filters?.eventThemes) ? profile!.filters!.eventThemes : [],
    location: {
      useCurrent:
        typeof profile?.filters?.location?.useCurrent === "boolean" ? profile!.filters!.location!.useCurrent : true,
      range: typeof profile?.filters?.location?.range === "number" ? profile!.filters!.location!.range : 50,
      custom: profile?.filters?.location?.custom ?? undefined,
    },
    dateRange: {
      current: profile?.filters?.dateRange?.current ?? {
        day: true,
        week: false,
        month: false,
        year: false,
      },
      custom: profile?.filters?.dateRange?.custom ?? {
        startDate: null,
        endDate: null,
      },
    },
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    SecureStore.getItemAsync(SESSION_KEY)
      .then((stored) => {
        if (stored) {
          setSession(JSON.parse(stored))
        } else {
          setSession(null)
        }
      })
      .catch(() => setSession(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(
    async (email: string, password: string, onSessionReady?: (session: SessionType) => void) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("https://plannr.azurewebsites.net/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        if (!res.ok) throw new Error("Login failed")
        const data = await res.json()
        const profileRes = await fetch(`https://plannr.azurewebsites.net/api/profiles/by-email/${email}`, {
          headers: { Authorization: `Bearer ${data.token}` },
        })
        if (!profileRes.ok) throw new Error("Failed to fetch profile")
        const profile = await profileRes.json()
        const sessionWithProfile = { ...data, profile }
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(sessionWithProfile))
        setSession(sessionWithProfile)
        if (onSessionReady) onSessionReady(sessionWithProfile)
      } catch (err: any) {
        setError(err.message || "Login error")
        setSession(null)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const signup = useCallback(
    async (name: string, email: string, password: string, onSessionReady?: (session: SessionType) => void) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("https://plannr.azurewebsites.net/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        })
        if (!res.ok) throw new Error("Signup failed")
        const data = await res.json()
        const profileRes = await fetch(`https://plannr.azurewebsites.net/api/profiles/by-email/${email}`, {
          headers: { Authorization: `Bearer ${data.token}` },
        })
        if (!profileRes.ok) throw new Error("Failed to fetch profile")
        const profile = await profileRes.json()
        const sessionWithProfile = { ...data, profile }
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(sessionWithProfile))
        setSession(sessionWithProfile)
        if (onSessionReady) onSessionReady(sessionWithProfile)
      } catch (err: any) {
        setError(err.message || "Signup error")
        setSession(null)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    await SecureStore.deleteItemAsync(SESSION_KEY)
    setSession(null)
    setLoading(false)
  }, [])

  return (
    <SessionContext.Provider value={{ session, loading, error, login, signup, logout }}>
      {children}
    </SessionContext.Provider>
  )
}
