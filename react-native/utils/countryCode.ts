// Utility to convert country names to ISO 3166-1 alpha-2 codes
// Source: https://www.iban.com/country-codes (can be extended)

import { getCode } from "country-list"

export function getCountryCode(input: string): string | undefined {
  if (!input) return undefined
  // If already a 2-letter code, return input as uppercase
  if (/^[A-Za-z]{2}$/.test(input)) return input.toUpperCase()
  // Use country-list to get code from name
  const code = getCode(input.trim())
  return code ? code.toUpperCase() : undefined
}
