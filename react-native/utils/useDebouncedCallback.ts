import { useCallback, useRef } from "react"

export function useDebouncedCallback<T extends (...args: unknown[]) => void>(callback: T, delay: number) {
  const timeout = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeout.current) clearTimeout(timeout.current)
      timeout.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )
}
