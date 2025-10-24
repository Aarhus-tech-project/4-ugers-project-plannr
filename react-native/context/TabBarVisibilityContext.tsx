import React, { createContext, useContext, useState } from "react"

interface TabBarVisibilityContextType {
  visible: boolean
  setVisible: (v: boolean) => void
}

const TabBarVisibilityContext = createContext<TabBarVisibilityContextType | undefined>(undefined)

export function TabBarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true)
  return <TabBarVisibilityContext.Provider value={{ visible, setVisible }}>{children}</TabBarVisibilityContext.Provider>
}

export function useTabBarVisibility() {
  const ctx = useContext(TabBarVisibilityContext)
  if (!ctx) throw new Error("useTabBarVisibility must be used within TabBarVisibilityProvider")
  return ctx
}
