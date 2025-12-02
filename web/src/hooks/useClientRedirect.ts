import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * Redirect to a page if authenticated
 */
export function useAuthenticatedRedirect(redirectTo: string = "/") {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(redirectTo)
    }
  }, [session, status, router, redirectTo])

  return { isAuthenticated: !!session, isLoading: status === "loading" }
}

/**
 * Redirect to login if not authenticated
 */
export function useRequireAuth(redirectTo: string = "/login") {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(redirectTo)
    }
  }, [session, status, router, redirectTo])

  return { session, isLoading: status === "loading" }
}
