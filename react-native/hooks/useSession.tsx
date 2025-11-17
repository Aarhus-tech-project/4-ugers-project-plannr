import { api } from "@/config/api"
import { Filter } from "@/interfaces/filter"
import { Profile } from "@/interfaces/profile"
import { SessionType } from "@/interfaces/session"
import * as SecureStore from "expo-secure-store"
import React, { createContext, useContext, useEffect, useState } from "react"
import { useAsyncFn } from "./useAsyncFn"

const SESSION_KEY = "user_session"

interface SessionContextType {
  session: SessionType | null
  login: ReturnType<typeof useAsyncFn>
  signup: ReturnType<typeof useAsyncFn>
  logout: ReturnType<typeof useAsyncFn>
}

interface SessionContextType {
  session: SessionType | null
  login: ReturnType<typeof useAsyncFn>
  signup: ReturnType<typeof useAsyncFn>
  logout: ReturnType<typeof useAsyncFn>
  setProfile: (profile: Profile) => void
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  login: { loading: false, error: null, data: null, run: async () => {} },
  signup: { loading: false, error: null, data: null, run: async () => {} },
  logout: { loading: false, error: null, data: null, run: async () => {} },
  setProfile: () => {},
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

  // Add setProfile method to update the profile in session
  const setProfile = (profile: Profile) => {
    setSession((prev) => {
      if (!prev) return prev
      const updated = { ...prev, profile }
      SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(updated))
      return updated
    })
  }

  useEffect(() => {
    SecureStore.getItemAsync(SESSION_KEY)
      .then((stored) => {
        if (stored) {
          const parsed = JSON.parse(stored)
          // If session is older than 20 minutes, logout
          if (parsed.loginAt && Date.now() - parsed.loginAt > 20 * 60 * 1000) {
            SecureStore.deleteItemAsync(SESSION_KEY)
            setSession(null)
          } else {
            setSession(parsed)
          }
        } else {
          setSession(null)
        }
      })
      .catch(() => setSession(null))
  }, [])

  const login = useAsyncFn(async (email: string, password: string) => {
    const data = await api.auth.login(email, password)
    if (!data || !data.profileId || !data.token) {
      throw new Error("Invalid login response: missing profileId or token")
    }
    const profile = await api.profiles.get(data.profileId, data.token)
    const sessionObj = {
      profile,
      provider: "manual",
      token: data.token,
      loginAt: Date.now(),
    }
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(sessionObj))
    setSession(sessionObj)
    return sessionObj
  })

  const signup = useAsyncFn(async (name: string, email: string, password: string) => {
    const profile = await api.auth.register({ name, email, password })
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify({ profile }))
    setSession(null) // No session until login
    return profile
  })

  const logout = useAsyncFn(async () => {
    await SecureStore.deleteItemAsync(SESSION_KEY)
    setSession(null)
    return null
  })

  return (
    <SessionContext.Provider value={{ session, login, signup, logout, setProfile }}>{children}</SessionContext.Provider>
  )
}
