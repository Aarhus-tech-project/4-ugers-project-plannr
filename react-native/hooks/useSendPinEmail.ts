import { sendPinEmailDirect } from "@/utils/sendPinEmailDirect"
import { useState } from "react"

/**
 * useSendPinEmail - Hook to send a PIN to an email address via backend API
 * @returns sendPinEmail(email: string, pin: string): Promise<void>
 *          loading: boolean
 *          error: string | null
 */
export function useSendPinEmail() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendPinEmail(email: string, pin: string) {
    setLoading(true)
    setError(null)
    try {
      await sendPinEmailDirect(email, pin)
    } catch (e: any) {
      setError(e.message || "Failed to send PIN email.")
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { sendPinEmail, loading, error }
}
