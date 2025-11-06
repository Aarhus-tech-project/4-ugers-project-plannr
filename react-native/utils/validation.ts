// Utility validation functions for registration and forms

export function isValidEmail(email: string): boolean {
  return typeof email === "string" && email.includes("@") && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
}

export function isValidPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 6
}

export function isNonEmptyString(str: string): boolean {
  return typeof str === "string" && str.trim().length > 0
}
