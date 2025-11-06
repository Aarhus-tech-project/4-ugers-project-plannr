import { isValidEmail } from "@/utils/validation"
import { useState } from "react"

export function useEmailExists() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exists, setExists] = useState<boolean | null>(null)

  const checkEmail = async (email: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    setExists(null)
    // Validate email format before API call
    if (!isValidEmail(email)) {
      setError("Invalid email format.")
      setExists(false)
      setLoading(false)
      return false
    }
    try {
      const res = await fetch(`https://plannr.azurewebsites.net/api/profiles/by-email/${encodeURIComponent(email)}`)
      if (res.ok) {
        const data = await res.json()
        setExists(!!(data && data.email))
        setLoading(false)
        return !!(data && data.email)
      } else {
        setExists(false)
        setLoading(false)
        return false
      }
    } catch (err) {
      setError(`Failed to check email existence. ${err instanceof Error ? err.message : String(err)}`)
      setExists(false)
      setLoading(false)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { exists, loading, error, checkEmail }
}
