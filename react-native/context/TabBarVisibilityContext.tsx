import React, { createContext, useContext, useState } from "react"

interface TabBarVisibilityContextType {
  visible: boolean
  setVisible: (v: boolean) => void
  scrollY: import("react-native").Animated.Value | null
  setScrollY: (v: import("react-native").Animated.Value) => void
}

const TabBarVisibilityContext = createContext<TabBarVisibilityContextType | undefined>(undefined)

export function TabBarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true)
  const [scrollY, setScrollY] = useState<import("react-native").Animated.Value | null>(null)
  return (
    <TabBarVisibilityContext.Provider value={{ visible, setVisible, scrollY, setScrollY }}>
      {children}
    </TabBarVisibilityContext.Provider>
  )
}

export function useTabBarVisibility() {
  const ctx = useContext(TabBarVisibilityContext)
  if (!ctx) throw new Error("useTabBarVisibility must be used within TabBarVisibilityProvider")
  return ctx
}
