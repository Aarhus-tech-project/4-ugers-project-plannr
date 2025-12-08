import type { Session } from "next-auth"
import { redirect } from "next/navigation"

/**
 * Redirect to login if not authenticated
 * Use in Server Components
 */
export function requireAuthRedirect(session: Session | null): void {
  if (!session) {
    redirect("/login")
  }
}

/**
 * Redirect to home if already authenticated
 * Use in Server Components
 */
export function redirectIfAuthenticated(session: Session | null): void {
  if (session) {
    redirect("/")
  }
}

/**
 * Format location for display
 */
export function formatLocation(
  location?: { venue?: string; address?: string; city?: string; country?: string } | string
): string {
  if (!location) return ""

  if (typeof location === "string") return location

  return [location.venue, location.address, location.city, location.country].filter(Boolean).join(", ")
}

/**
 * Format date for display
 */
export function formatDate(date?: string | Date): string {
  if (!date) return ""

  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8
}
