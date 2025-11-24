import { useCallback, useEffect, useRef, useState } from "react"

export function useAsyncFn<TArgs extends any[], TResult>(fn: (...args: TArgs) => Promise<TResult>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TResult | null>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      setLoading(true)
      setError(null)
      try {
        const result = await fn(...args)
        if (isMounted.current) setData(result)
        return result
      } catch (err: any) {
        if (isMounted.current) setError(err.message)
        return null
      } finally {
        if (isMounted.current) setLoading(false)
      }
    },
    [fn]
  )

  return { loading, error, data, run }
}
