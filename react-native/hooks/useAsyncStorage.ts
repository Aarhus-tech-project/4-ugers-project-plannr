import AsyncStorage from "@react-native-async-storage/async-storage"
import { useCallback, useEffect, useRef, useState } from "react"

/**
 * useAsyncStorage - React hook for persistent state synced with AsyncStorage
 * @param key - AsyncStorage key
 * @param initialValue - initial value if nothing is stored
 * @returns [value, setValue, loading, error]
 */
export function useAsyncStorage<T>(
  key: string,
  initialValue: T
): [T, (v: T | ((prev: T) => T)) => void, boolean, string | null, () => Promise<void>] {
  const [value, setValue] = useState<T>(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load from AsyncStorage on mount and provide reload function
  const loadValue = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(key)
      if (stored !== null) {
        const parsed = JSON.parse(stored)
        setValue(parsed)
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [key])

  useEffect(() => {
    let cancelled = false as boolean
    ;(async () => {
      if (!cancelled) await loadValue()
    })()
    return () => {
      cancelled = true
    }
  }, [key, loadValue])

  // Debounced save to AsyncStorage when value changes
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (loading) return // Don't save until initial load
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => {
      AsyncStorage.setItem(key, JSON.stringify(value)).catch((e) => {
        setError(e.message)
      })
    }, 200) // 200ms debounce for performance
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
  }, [key, value, loading])

  // Setter (supports value and functional updates)
  const setStoredValue = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === "function" ? (v as (prev: T) => T)(prev) : v
        AsyncStorage.setItem(key, JSON.stringify(next)).catch((e) => {
          setError(e.message)
        })
        return next
      })
    },
    [key]
  )

  // Return reload function as 5th argument
  return [value, setStoredValue, loading, error, loadValue]
}
