import React, { createContext, useContext, useState } from "react"

const PreferencesVersionContext = createContext<{
  version: number
  bump: () => void
}>({
  version: 0,
  bump: () => {},
})

export const PreferencesVersionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [version, setVersion] = useState(0)
  const bump = () => setVersion((v) => v + 1)
  return <PreferencesVersionContext.Provider value={{ version, bump }}>{children}</PreferencesVersionContext.Provider>
}

export const usePreferencesVersion = () => useContext(PreferencesVersionContext)
